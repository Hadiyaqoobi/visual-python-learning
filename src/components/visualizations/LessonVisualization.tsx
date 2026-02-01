"use client";
import { Suspense } from 'react';
import dynamic from 'next/dynamic';

// Chapter 25: ML Foundations
const AIJourney = dynamic(() => import('./ml/AIJourney'), { ssr: false });
const HowAILearns = dynamic(() => import('./ml/HowAILearns'), { ssr: false });
const SupervisedLearning3D = dynamic(() => import('./ml/SupervisedLearning3D'), { ssr: false });
const UnsupervisedClustering3D = dynamic(() => import('./ml/UnsupervisedClustering3D'), { ssr: false });
const ConfusionMatrix3D = dynamic(() => import('./ml/ConfusionMatrix3D'), { ssr: false });
const TrainTestSplit3D = dynamic(() => import('./ml/TrainTestSplit3D'), { ssr: false });
const OverfittingUnderfitting3D = dynamic(() => import('./ml/OverfittingUnderfitting3D'), { ssr: false });
const GradientDescent = dynamic(() => import('./ml/GradientDescent'), { ssr: false });
const LinearRegression = dynamic(() => import('./ml/LinearRegression'), { ssr: false });
const LogisticRegression = dynamic(() => import('./ml/LogisticRegression'), { ssr: false });
const KNearestNeighbors = dynamic(() => import('./ml/KNearestNeighbors'), { ssr: false });
const DecisionTreeViz = dynamic(() => import('./ml/DecisionTreeViz'), { ssr: false });
const RandomForest = dynamic(() => import('./ml/RandomForest'), { ssr: false });
const BiasVariance = dynamic(() => import('./ml/BiasVariance'), { ssr: false });
const CrossValidation = dynamic(() => import('./ml/CrossValidation'), { ssr: false });
const Regularization = dynamic(() => import('./ml/Regularization'), { ssr: false });

// Chapter 26
const PerceptronViz = dynamic(() => import('./nn/PerceptronViz'), { ssr: false });
const BoundarySculptor = dynamic(() => import('./nn/BoundarySculptor'), { ssr: false });
const PerceptronLearning = dynamic(() => import('./nn/PerceptronLearning'), { ssr: false });
const ActivationFunctions = dynamic(() => import('./nn/ActivationFunctions'), { ssr: false });
const XORProblem = dynamic(() => import('./nn/XORProblem'), { ssr: false });
const MLPIntro = dynamic(() => import('./nn/MLPIntro'), { ssr: false });

// Chapter 27
const NetworkArchitecture = dynamic(() => import('./nn/NetworkArchitecture'), { ssr: false });
const ForwardPropagation = dynamic(() => import('./nn/ForwardPropagation'), { ssr: false });
const LossFunctions = dynamic(() => import('./nn/LossFunctions'), { ssr: false });
const BackpropagationViz = dynamic(() => import('./nn/BackpropagationViz'), { ssr: false });
const GradientFlow = dynamic(() => import('./nn/GradientFlow'), { ssr: false });
const TrainingLive = dynamic(() => import('./nn/TrainingLive'), { ssr: false });

// Chapter 28
const DeepLearningIntro = dynamic(() => import('./deep/DeepLearningIntro'), { ssr: false });
const CNNViz = dynamic(() => import('./deep/CNNViz'), { ssr: false });
const ConvolutionDemo = dynamic(() => import('./deep/ConvolutionDemo'), { ssr: false });
const PoolingViz = dynamic(() => import('./deep/PoolingViz'), { ssr: false });
const RNNViz = dynamic(() => import('./deep/RNNViz'), { ssr: false });
const ModernArchitectures = dynamic(() => import('./deep/ModernArchitectures'), { ssr: false });

// Chapter 29
const MLPipeline = dynamic(() => import('./ml/MLPipeline'), { ssr: false });
const DataPreprocessing = dynamic(() => import('./ml/DataPreprocessing'), { ssr: false });
const FeatureEngineering = dynamic(() => import('./ml/FeatureEngineering'), { ssr: false });
const ModelSelection = dynamic(() => import('./ml/ModelSelection'), { ssr: false });
const HyperparameterTuning = dynamic(() => import('./ml/HyperparameterTuning'), { ssr: false });
const CompleteProject = dynamic(() => import('./ml/CompleteProject'), { ssr: false });

// Chapter 30
const TensorViz = dynamic(() => import('./pytorch/TensorViz'), { ssr: false });
const AutogradViz = dynamic(() => import('./pytorch/AutogradViz'), { ssr: false });
const NNModuleViz = dynamic(() => import('./pytorch/NNModuleViz'), { ssr: false });
const TrainingLoopViz = dynamic(() => import('./pytorch/TrainingLoopViz'), { ssr: false });
const DataLoaderViz = dynamic(() => import('./pytorch/DataLoaderViz'), { ssr: false });
const CNNProjectViz = dynamic(() => import('./pytorch/CNNProjectViz'), { ssr: false });

const VISUALIZATIONS: Record<string, React.ComponentType> = {
  // Chapter 25
  'what-is-machine-learning': AIJourney,
  'ml-types-supervised-unsupervised-reinforcement': SupervisedLearning3D,
  'features-and-labels': HowAILearns,
  'train-validation-test-sets': TrainTestSplit3D,
  'linear-regression': LinearRegression,
  'gradient-descent': GradientDescent,
  'logistic-regression': LogisticRegression,
  'model-evaluation-metrics': ConfusionMatrix3D,
  'cross-validation': CrossValidation,
  'bias-variance-tradeoff': BiasVariance,
  'overfitting-and-underfitting': OverfittingUnderfitting3D,
  'regularization': Regularization,
  'k-nearest-neighbors': KNearestNeighbors,
  'decision-trees': DecisionTreeViz,
  'random-forests': RandomForest,
  'k-means-clustering': UnsupervisedClustering3D,

  // Chapter 26
  'what-is-a-perceptron': PerceptronViz,
  'linear-decision-boundaries': BoundarySculptor,
  'perceptron-learning-algorithm': PerceptronLearning,
  'activation-functions': ActivationFunctions,
  'xor-problem': XORProblem,
  'multi-layer-perceptrons': MLPIntro,

  // Chapter 27
  'neural-network-architecture': NetworkArchitecture,
  'forward-propagation': ForwardPropagation,
  'loss-functions': LossFunctions,
  'backpropagation': BackpropagationViz,
  'gradient-flow-problems': GradientFlow,
  'training-neural-networks': TrainingLive,

  // Chapter 28
  'introduction-to-deep-learning': DeepLearningIntro,
  'convolutional-neural-networks': CNNViz,
  'convolution-operation': ConvolutionDemo,
  'pooling-layers': PoolingViz,
  'recurrent-neural-networks': RNNViz,
  'modern-architectures': ModernArchitectures,

  // Chapter 29
  'ml-pipeline-overview': MLPipeline,
  'data-preprocessing': DataPreprocessing,
  'feature-engineering': FeatureEngineering,
  'model-selection': ModelSelection,
  'hyperparameter-tuning': HyperparameterTuning,
  'complete-ml-project': CompleteProject,

  // Chapter 30
  'pytorch-tensors': TensorViz,
  'pytorch-autograd': AutogradViz,
  'pytorch-nn-module': NNModuleViz,
  'pytorch-training-loop': TrainingLoopViz,
  'pytorch-data-loading': DataLoaderViz,
  'pytorch-cnn-project': CNNProjectViz,
};

interface LessonVisualizationProps {
  lessonSlug: string;
}

export function LessonVisualization({ lessonSlug }: LessonVisualizationProps) {
  const VisualizationComponent = VISUALIZATIONS[lessonSlug];
  
  if (!VisualizationComponent) return null;
  
  return (
    <div style={{
      marginBottom: '24px', borderRadius: '16px', overflow: 'hidden',
      border: '1px solid #e2e8f0', boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
    }}>
      <div style={{
        background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
        padding: '12px 20px', display: 'flex', alignItems: 'center', gap: '10px',
      }}>
        <span style={{ fontSize: '20px' }}>🎮</span>
        <span style={{ color: 'white', fontWeight: '600', fontSize: '14px' }}>Interactive Visualization</span>
      </div>
      <div style={{ maxHeight: '800px', overflow: 'auto' }}>
        <Suspense fallback={
          <div style={{ height: '400px', background: '#1a1a2e', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <p style={{ color: '#94a3b8' }}>Loading...</p>
          </div>
        }>
          <VisualizationComponent />
        </Suspense>
      </div>
    </div>
  );
}
