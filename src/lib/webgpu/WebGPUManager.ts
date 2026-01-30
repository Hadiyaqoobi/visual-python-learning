/**
 * WebGPU Manager - Core WebGPU initialization and utilities
 * Handles GPU device creation, compute pipelines, and graceful fallback
 */

export interface WebGPUCapabilities {
  supported: boolean;
  adapter: GPUAdapter | null;
  device: GPUDevice | null;
  preferredFormat: GPUTextureFormat | null;
  maxComputeWorkgroupSize: number;
  maxStorageBufferSize: number;
}

export interface ComputeShaderConfig {
  code: string;
  entryPoint: string;
  workgroupSize: [number, number?, number?];
}

export interface StorageBufferConfig {
  size: number;
  usage: GPUBufferUsageFlags;
  label?: string;
}

class WebGPUManagerClass {
  private static instance: WebGPUManagerClass;
  
  private _initialized = false;
  private _adapter: GPUAdapter | null = null;
  private _device: GPUDevice | null = null;
  private _preferredFormat: GPUTextureFormat | null = null;
  private _capabilities: WebGPUCapabilities | null = null;
  private _initPromise: Promise<WebGPUCapabilities> | null = null;
  
  // Event listeners for device lost
  private _deviceLostListeners: ((reason: string) => void)[] = [];

  private constructor() {}

  static getInstance(): WebGPUManagerClass {
    if (!WebGPUManagerClass.instance) {
      WebGPUManagerClass.instance = new WebGPUManagerClass();
    }
    return WebGPUManagerClass.instance;
  }

  /**
   * Check if WebGPU is supported in current browser
   */
  static isSupported(): boolean {
    return typeof navigator !== 'undefined' && 'gpu' in navigator;
  }

  /**
   * Get browser info for support detection
   */
  static getBrowserInfo(): { name: string; version: number; webgpuSupported: boolean } {
    const ua = navigator.userAgent;
    let name = 'unknown';
    let version = 0;

    if (ua.includes('Chrome')) {
      name = 'chrome';
      const match = ua.match(/Chrome\/(\d+)/);
      version = match ? parseInt(match[1]) : 0;
    } else if (ua.includes('Firefox')) {
      name = 'firefox';
      const match = ua.match(/Firefox\/(\d+)/);
      version = match ? parseInt(match[1]) : 0;
    } else if (ua.includes('Safari') && !ua.includes('Chrome')) {
      name = 'safari';
      const match = ua.match(/Version\/(\d+)/);
      version = match ? parseInt(match[1]) : 0;
    } else if (ua.includes('Edge')) {
      name = 'edge';
      const match = ua.match(/Edge\/(\d+)/);
      version = match ? parseInt(match[1]) : 0;
    }

    const WEBGPU_SUPPORT: Record<string, number> = {
      chrome: 113,
      edge: 113,
      firefox: 141,
      safari: 18,
    };

    const webgpuSupported = WebGPUManagerClass.isSupported() && 
      (WEBGPU_SUPPORT[name] ? version >= WEBGPU_SUPPORT[name] : false);

    return { name, version, webgpuSupported };
  }

  /**
   * Initialize WebGPU - returns capabilities object
   * Safe to call multiple times (will return cached result)
   */
  async initialize(): Promise<WebGPUCapabilities> {
    // Return existing promise if already initializing
    if (this._initPromise) {
      return this._initPromise;
    }

    this._initPromise = this._doInitialize();
    return this._initPromise;
  }

  private async _doInitialize(): Promise<WebGPUCapabilities> {
    // Return cached capabilities if already initialized
    if (this._initialized && this._capabilities) {
      return this._capabilities;
    }

    // Check basic support
    if (!WebGPUManagerClass.isSupported()) {
      this._capabilities = {
        supported: false,
        adapter: null,
        device: null,
        preferredFormat: null,
        maxComputeWorkgroupSize: 0,
        maxStorageBufferSize: 0,
      };
      return this._capabilities;
    }

    try {
      // Request adapter
      this._adapter = await navigator.gpu.requestAdapter({
        powerPreference: 'high-performance',
      });

      if (!this._adapter) {
        throw new Error('No WebGPU adapter available');
      }

      // Request device with required features
      this._device = await this._adapter.requestDevice({
        requiredFeatures: [],
        requiredLimits: {
          maxStorageBufferBindingSize: this._adapter.limits.maxStorageBufferBindingSize,
          maxComputeWorkgroupSizeX: 256,
          maxComputeWorkgroupSizeY: 256,
          maxComputeWorkgroupSizeZ: 64,
        },
      });

      // Handle device lost
      this._device.lost.then((info) => {
        console.error('WebGPU device lost:', info.message);
        this._deviceLostListeners.forEach(listener => listener(info.message));
        
        // Try to recover
        if (info.reason !== 'destroyed') {
          this._initialized = false;
          this._initPromise = null;
          this.initialize();
        }
      });

      // Get preferred canvas format
      this._preferredFormat = navigator.gpu.getPreferredCanvasFormat();

      // Build capabilities
      this._capabilities = {
        supported: true,
        adapter: this._adapter,
        device: this._device,
        preferredFormat: this._preferredFormat,
        maxComputeWorkgroupSize: this._adapter.limits.maxComputeWorkgroupSizeX,
        maxStorageBufferSize: this._adapter.limits.maxStorageBufferBindingSize,
      };

      this._initialized = true;
      console.log('✅ WebGPU initialized successfully', {
        maxWorkgroupSize: this._capabilities.maxComputeWorkgroupSize,
        maxStorageBuffer: `${(this._capabilities.maxStorageBufferSize / 1024 / 1024).toFixed(0)}MB`,
      });

      return this._capabilities;
    } catch (error) {
      console.warn('WebGPU initialization failed:', error);
      
      this._capabilities = {
        supported: false,
        adapter: null,
        device: null,
        preferredFormat: null,
        maxComputeWorkgroupSize: 0,
        maxStorageBufferSize: 0,
      };
      
      return this._capabilities;
    }
  }

  /**
   * Get current capabilities (must call initialize first)
   */
  get capabilities(): WebGPUCapabilities | null {
    return this._capabilities;
  }

  /**
   * Get GPU device (must call initialize first)
   */
  get device(): GPUDevice | null {
    return this._device;
  }

  /**
   * Check if WebGPU is ready to use
   */
  get isReady(): boolean {
    return this._initialized && this._device !== null;
  }

  /**
   * Create a compute shader module
   */
  createComputeShader(config: ComputeShaderConfig): GPUComputePipeline | null {
    if (!this._device) {
      console.warn('WebGPU device not available');
      return null;
    }

    try {
      const shaderModule = this._device.createShaderModule({
        code: config.code,
      });

      const pipeline = this._device.createComputePipeline({
        layout: 'auto',
        compute: {
          module: shaderModule,
          entryPoint: config.entryPoint,
        },
      });

      return pipeline;
    } catch (error) {
      console.error('Failed to create compute shader:', error);
      return null;
    }
  }

  /**
   * Create a storage buffer for compute operations
   */
  createStorageBuffer(config: StorageBufferConfig): GPUBuffer | null {
    if (!this._device) {
      console.warn('WebGPU device not available');
      return null;
    }

    try {
      const buffer = this._device.createBuffer({
        size: config.size,
        usage: config.usage,
        label: config.label,
        mappedAtCreation: false,
      });

      return buffer;
    } catch (error) {
      console.error('Failed to create storage buffer:', error);
      return null;
    }
  }

  /**
   * Create a uniform buffer
   */
  createUniformBuffer(size: number, label?: string): GPUBuffer | null {
    return this.createStorageBuffer({
      size,
      usage: GPUBufferUsage.UNIFORM | GPUBufferUsage.COPY_DST,
      label,
    });
  }

  /**
   * Write data to a buffer
   */
  writeBuffer(buffer: GPUBuffer, data: ArrayBuffer | ArrayBufferView, offset = 0): void {
    if (!this._device) return;
    this._device.queue.writeBuffer(buffer, offset, data);
  }

  /**
   * Read data from a buffer (async)
   */
  async readBuffer(buffer: GPUBuffer, size: number): Promise<ArrayBuffer | null> {
    if (!this._device) return null;

    // Create staging buffer for reading
    const stagingBuffer = this._device.createBuffer({
      size,
      usage: GPUBufferUsage.MAP_READ | GPUBufferUsage.COPY_DST,
    });

    // Copy to staging buffer
    const commandEncoder = this._device.createCommandEncoder();
    commandEncoder.copyBufferToBuffer(buffer, 0, stagingBuffer, 0, size);
    this._device.queue.submit([commandEncoder.finish()]);

    // Map and read
    await stagingBuffer.mapAsync(GPUMapMode.READ);
    const data = stagingBuffer.getMappedRange().slice(0);
    stagingBuffer.unmap();
    stagingBuffer.destroy();

    return data;
  }

  /**
   * Submit compute commands
   */
  submitCompute(
    pipeline: GPUComputePipeline,
    bindGroups: GPUBindGroup[],
    workgroupCount: [number, number?, number?]
  ): void {
    if (!this._device) return;

    const commandEncoder = this._device.createCommandEncoder();
    const passEncoder = commandEncoder.beginComputePass();

    passEncoder.setPipeline(pipeline);
    bindGroups.forEach((bg, i) => passEncoder.setBindGroup(i, bg));
    passEncoder.dispatchWorkgroups(
      workgroupCount[0],
      workgroupCount[1] ?? 1,
      workgroupCount[2] ?? 1
    );
    passEncoder.end();

    this._device.queue.submit([commandEncoder.finish()]);
  }

  /**
   * Add listener for device lost events
   */
  onDeviceLost(listener: (reason: string) => void): () => void {
    this._deviceLostListeners.push(listener);
    return () => {
      const idx = this._deviceLostListeners.indexOf(listener);
      if (idx >= 0) this._deviceLostListeners.splice(idx, 1);
    };
  }

  /**
   * Dispose of all WebGPU resources
   */
  dispose(): void {
    if (this._device) {
      this._device.destroy();
      this._device = null;
    }
    this._adapter = null;
    this._initialized = false;
    this._capabilities = null;
    this._initPromise = null;
  }
}

// Export singleton instance
export const WebGPUManager = WebGPUManagerClass.getInstance();
export default WebGPUManager;
