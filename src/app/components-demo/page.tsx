"use client";

import { useState } from "react";
import { Button, Input, Textarea, Badge, Alert, Spinner, Modal, Card } from "@/components/ui";
import { Search, Mail, Lock, User, Phone } from "lucide-react";

export default function ComponentsDemoPage() {
  const [loadingStates, setLoadingStates] = useState<Record<string, boolean>>({});
  const [inputValue, setInputValue] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [alerts, setAlerts] = useState({
    info: true,
    success: true,
    warning: true,
    error: true,
  });

  const handleLoadingDemo = (key: string) => {
    setLoadingStates((prev) => ({ ...prev, [key]: true }));
    setTimeout(() => {
      setLoadingStates((prev) => ({ ...prev, [key]: false }));
    }, 2000);
  };

  return (
    <div className="min-h-screen bg-secondary-50 p-8">
      <div className="max-w-6xl mx-auto">
        <div className="mb-12">
          <h1 className="text-4xl font-bold text-secondary-900 mb-2">
            Component Library
          </h1>
          <p className="text-secondary-600 text-lg">
            Visual Python Learning Platform - Design System
          </p>
        </div>

        {/* Button Component */}
        <section className="mb-16">
          <h2 className="text-2xl font-bold text-secondary-900 mb-6 pb-2 border-b border-secondary-200">
            Button
          </h2>

          <div className="space-y-8">
            <div>
              <h3 className="text-lg font-semibold text-secondary-800 mb-4">Variants</h3>
              <div className="flex flex-wrap gap-4 p-6 bg-white rounded-xl border border-secondary-200">
                <Button variant="primary">Primary</Button>
                <Button variant="secondary">Secondary</Button>
                <Button variant="outline">Outline</Button>
                <Button variant="ghost">Ghost</Button>
                <Button variant="danger">Danger</Button>
                <Button variant="success">Success</Button>
              </div>
            </div>

            <div>
              <h3 className="text-lg font-semibold text-secondary-800 mb-4">Sizes</h3>
              <div className="flex flex-wrap items-center gap-4 p-6 bg-white rounded-xl border border-secondary-200">
                <Button size="xs">Extra Small</Button>
                <Button size="sm">Small</Button>
                <Button size="md">Medium</Button>
                <Button size="lg">Large</Button>
                <Button size="xl">Extra Large</Button>
              </div>
            </div>

            <div>
              <h3 className="text-lg font-semibold text-secondary-800 mb-4">States</h3>
              <div className="flex flex-wrap items-center gap-4 p-6 bg-white rounded-xl border border-secondary-200">
                <Button>Default</Button>
                <Button disabled>Disabled</Button>
                <Button isLoading={loadingStates["btn1"]} onClick={() => handleLoadingDemo("btn1")}>
                  Click to Load
                </Button>
              </div>
            </div>
          </div>
        </section>

        {/* Input Component */}
        <section className="mb-16">
          <h2 className="text-2xl font-bold text-secondary-900 mb-6 pb-2 border-b border-secondary-200">
            Input
          </h2>

          <div className="space-y-8">
            <div>
              <h3 className="text-lg font-semibold text-secondary-800 mb-4">Basic Inputs</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-6 bg-white rounded-xl border border-secondary-200">
                <Input label="Email" type="email" placeholder="you@example.com" />
                <Input label="Username" placeholder="johndoe" helperText="Choose a unique username" />
              </div>
            </div>

            <div>
              <h3 className="text-lg font-semibold text-secondary-800 mb-4">With Icons</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-6 bg-white rounded-xl border border-secondary-200">
                <Input label="Search" placeholder="Search..." leftIcon={<Search className="w-5 h-5" />} />
                <Input label="Email" placeholder="you@example.com" leftIcon={<Mail className="w-5 h-5" />} />
                <Input label="Phone" placeholder="+1 (555) 000-0000" leftIcon={<Phone className="w-5 h-5" />} />
                <Input label="Username" placeholder="johndoe" leftIcon={<User className="w-5 h-5" />} />
              </div>
            </div>

            <div>
              <h3 className="text-lg font-semibold text-secondary-800 mb-4">Password with Toggle</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-6 bg-white rounded-xl border border-secondary-200">
                <Input
                  label="Password"
                  type="password"
                  placeholder="Enter password"
                  leftIcon={<Lock className="w-5 h-5" />}
                  showPasswordToggle
                />
                <Input
                  label="Confirm Password"
                  type="password"
                  placeholder="Confirm password"
                  leftIcon={<Lock className="w-5 h-5" />}
                  showPasswordToggle
                />
              </div>
            </div>

            <div>
              <h3 className="text-lg font-semibold text-secondary-800 mb-4">States</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-6 bg-white rounded-xl border border-secondary-200">
                <Input label="Error State" placeholder="Enter text" error="This field is required" />
                <Input label="Success State" placeholder="Enter text" success="Looks good!" defaultValue="Valid input" />
                <Input label="Disabled" placeholder="Cannot edit" disabled />
                <Input label="Required" placeholder="This is required" required />
              </div>
            </div>

            <div>
              <h3 className="text-lg font-semibold text-secondary-800 mb-4">Clearable with Character Count</h3>
              <div className="p-6 bg-white rounded-xl border border-secondary-200">
                <Input
                  label="Bio"
                  placeholder="Tell us about yourself"
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  clearable
                  onClear={() => setInputValue("")}
                  showCharCount
                  maxLength={100}
                  helperText="Write a short bio"
                />
              </div>
            </div>

            <div>
              <h3 className="text-lg font-semibold text-secondary-800 mb-4">Sizes</h3>
              <div className="space-y-4 p-6 bg-white rounded-xl border border-secondary-200">
                <Input inputSize="sm" placeholder="Small input" />
                <Input inputSize="md" placeholder="Medium input (default)" />
                <Input inputSize="lg" placeholder="Large input" />
              </div>
            </div>
          </div>
        </section>

        {/* Textarea Component */}
        <section className="mb-16">
          <h2 className="text-2xl font-bold text-secondary-900 mb-6 pb-2 border-b border-secondary-200">
            Textarea
          </h2>

          <div className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-6 bg-white rounded-xl border border-secondary-200">
              <Textarea label="Description" placeholder="Enter a description..." helperText="Be as detailed as you'd like" />
              <Textarea
                label="With Character Count"
                placeholder="Write your message..."
                showCharCount
                maxLength={500}
              />
              <Textarea label="Error State" placeholder="Enter text" error="This field is required" />
              <Textarea label="Success State" defaultValue="Great content!" success="Perfect!" />
            </div>
          </div>
        </section>

        {/* Badge Component */}
        <section className="mb-16">
          <h2 className="text-2xl font-bold text-secondary-900 mb-6 pb-2 border-b border-secondary-200">
            Badge
          </h2>

          <div className="space-y-8">
            <div>
              <h3 className="text-lg font-semibold text-secondary-800 mb-4">Variants</h3>
              <div className="flex flex-wrap gap-4 p-6 bg-white rounded-xl border border-secondary-200">
                <Badge variant="default">Default</Badge>
                <Badge variant="primary">Primary</Badge>
                <Badge variant="secondary">Secondary</Badge>
                <Badge variant="success">Success</Badge>
                <Badge variant="warning">Warning</Badge>
                <Badge variant="error">Error</Badge>
                <Badge variant="info">Info</Badge>
              </div>
            </div>

            <div>
              <h3 className="text-lg font-semibold text-secondary-800 mb-4">With Dot</h3>
              <div className="flex flex-wrap gap-4 p-6 bg-white rounded-xl border border-secondary-200">
                <Badge variant="success" dot>Online</Badge>
                <Badge variant="warning" dot>Away</Badge>
                <Badge variant="error" dot>Offline</Badge>
                <Badge variant="info" dot>Busy</Badge>
              </div>
            </div>

            <div>
              <h3 className="text-lg font-semibold text-secondary-800 mb-4">Sizes</h3>
              <div className="flex flex-wrap items-center gap-4 p-6 bg-white rounded-xl border border-secondary-200">
                <Badge size="sm">Small</Badge>
                <Badge size="md">Medium</Badge>
                <Badge size="lg">Large</Badge>
              </div>
            </div>

            <div>
              <h3 className="text-lg font-semibold text-secondary-800 mb-4">Removable</h3>
              <div className="flex flex-wrap gap-4 p-6 bg-white rounded-xl border border-secondary-200">
                <Badge variant="primary" removable onRemove={() => alert("Remove clicked!")}>
                  React
                </Badge>
                <Badge variant="success" removable>TypeScript</Badge>
                <Badge variant="info" removable>Next.js</Badge>
              </div>
            </div>
          </div>
        </section>

        {/* Alert Component */}
        <section className="mb-16">
          <h2 className="text-2xl font-bold text-secondary-900 mb-6 pb-2 border-b border-secondary-200">
            Alert
          </h2>

          <div className="space-y-4 p-6 bg-white rounded-xl border border-secondary-200">
            {alerts.info && (
              <Alert
                variant="info"
                title="Information"
                dismissible
                onDismiss={() => setAlerts((prev) => ({ ...prev, info: false }))}
              >
                This is an informational message to help guide you.
              </Alert>
            )}
            {alerts.success && (
              <Alert
                variant="success"
                title="Success!"
                dismissible
                onDismiss={() => setAlerts((prev) => ({ ...prev, success: false }))}
              >
                Your changes have been saved successfully.
              </Alert>
            )}
            {alerts.warning && (
              <Alert
                variant="warning"
                title="Warning"
                dismissible
                onDismiss={() => setAlerts((prev) => ({ ...prev, warning: false }))}
              >
                Please review your input before continuing.
              </Alert>
            )}
            {alerts.error && (
              <Alert
                variant="error"
                title="Error"
                dismissible
                onDismiss={() => setAlerts((prev) => ({ ...prev, error: false }))}
              >
                Something went wrong. Please try again.
              </Alert>
            )}
            <Button
              variant="outline"
              size="sm"
              onClick={() => setAlerts({ info: true, success: true, warning: true, error: true })}
            >
              Reset Alerts
            </Button>
          </div>
        </section>

        {/* Spinner Component */}
        <section className="mb-16">
          <h2 className="text-2xl font-bold text-secondary-900 mb-6 pb-2 border-b border-secondary-200">
            Spinner
          </h2>

          <div className="space-y-8">
            <div>
              <h3 className="text-lg font-semibold text-secondary-800 mb-4">Sizes</h3>
              <div className="flex flex-wrap items-center gap-8 p-6 bg-white rounded-xl border border-secondary-200">
                <div className="text-center">
                  <Spinner size="xs" />
                  <p className="mt-2 text-sm text-secondary-500">XS</p>
                </div>
                <div className="text-center">
                  <Spinner size="sm" />
                  <p className="mt-2 text-sm text-secondary-500">SM</p>
                </div>
                <div className="text-center">
                  <Spinner size="md" />
                  <p className="mt-2 text-sm text-secondary-500">MD</p>
                </div>
                <div className="text-center">
                  <Spinner size="lg" />
                  <p className="mt-2 text-sm text-secondary-500">LG</p>
                </div>
                <div className="text-center">
                  <Spinner size="xl" />
                  <p className="mt-2 text-sm text-secondary-500">XL</p>
                </div>
              </div>
            </div>

            <div>
              <h3 className="text-lg font-semibold text-secondary-800 mb-4">Variants</h3>
              <div className="flex flex-wrap items-center gap-8 p-6 bg-white rounded-xl border border-secondary-200">
                <div className="text-center">
                  <Spinner variant="primary" size="lg" />
                  <p className="mt-2 text-sm text-secondary-500">Primary</p>
                </div>
                <div className="text-center">
                  <Spinner variant="secondary" size="lg" />
                  <p className="mt-2 text-sm text-secondary-500">Secondary</p>
                </div>
                <div className="text-center p-4 bg-secondary-800 rounded-lg">
                  <Spinner variant="white" size="lg" />
                  <p className="mt-2 text-sm text-secondary-300">White</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Modal Component */}
        <section className="mb-16">
          <h2 className="text-2xl font-bold text-secondary-900 mb-6 pb-2 border-b border-secondary-200">
            Modal
          </h2>

          <div className="p-6 bg-white rounded-xl border border-secondary-200">
            <Button onClick={() => setIsModalOpen(true)}>Open Modal</Button>

            <Modal
              isOpen={isModalOpen}
              onClose={() => setIsModalOpen(false)}
              title="Example Modal"
              description="This is a description of what this modal does."
              footer={
                <>
                  <Button variant="outline" onClick={() => setIsModalOpen(false)}>
                    Cancel
                  </Button>
                  <Button onClick={() => setIsModalOpen(false)}>Confirm</Button>
                </>
              }
            >
              <p className="text-secondary-600">
                This is the modal content. You can put any content here, including forms,
                images, or other components.
              </p>
              <div className="mt-4">
                <Input label="Example Input" placeholder="Type something..." />
              </div>
            </Modal>
          </div>
        </section>

        {/* Card Component */}
        <section className="mb-16">
          <h2 className="text-2xl font-bold text-secondary-900 mb-6 pb-2 border-b border-secondary-200">
            Card
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card variant="default" className="border border-secondary-200">
              <h3 className="text-lg font-semibold mb-2">Default Card</h3>
              <p className="text-secondary-600">This is a default card with basic styling.</p>
            </Card>
            <Card variant="bordered">
              <h3 className="text-lg font-semibold mb-2">Bordered Card</h3>
              <p className="text-secondary-600">This card has a visible border.</p>
            </Card>
            <Card variant="elevated">
              <h3 className="text-lg font-semibold mb-2">Elevated Card</h3>
              <p className="text-secondary-600">This card has a shadow elevation.</p>
            </Card>
          </div>
        </section>
      </div>
    </div>
  );
}
