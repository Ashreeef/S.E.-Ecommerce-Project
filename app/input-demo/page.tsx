"use client";

import { Input } from '@/components/ui';
import { Mail, User, Search, MapPin, Phone, Lock, Calendar } from 'lucide-react';
import { useState } from 'react';

export default function InputDemoPage() {
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [city, setCity] = useState('');
  const [loading, setLoading] = useState(false);
  const [hasError, setHasError] = useState(false);

  const cities = [
    'Algiers',
    'Oran',
    'Annaba',
    'Bejaia',
    'Constantine',
    'Setif'
  ];

  const handleLoadingTest = () => {
    setLoading(true);
    setTimeout(() => setLoading(false), 3000);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-neutral-50 to-neutral-100 p-8">
      <div className="max-w-6xl mx-auto space-y-12">
        {/* Header */}
        <div className="text-center space-y-4">
          <h1 className="text-4xl font-bold text-neutral-800">
            Input Component
          </h1>
          <p className="text-neutral-600">
            Versatile input fields with labels, icons, validation, and dropdown support
          </p>
        </div>

        {/* Basic Text Inputs */}
        <section className="bg-white rounded-2xl p-8 shadow-lg space-y-6">
          <h2 className="text-2xl font-semibold text-neutral-800">
            Basic Text Inputs
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Input
              label="Email Address"
              placeholder="Enter your email"
              value={email}
              onChange={setEmail}
              leftIcon={<Mail />}
            />
            <Input
              label="Full Name"
              placeholder="Enter your name"
              value={name}
              onChange={setName}
              leftIcon={<User />}
            />
            <Input
              label="Phone Number"
              placeholder="+1 (555) 000-0000"
              leftIcon={<Phone />}
            />
            <Input
              label="Password"
              placeholder="Enter password"
              leftIcon={<Lock />}
              rightIcon={<Calendar />}
            />
          </div>
        </section>

        {/* With Icons */}
        <section className="bg-white rounded-2xl p-8 shadow-lg space-y-6">
          <h2 className="text-2xl font-semibold text-neutral-800">
            With Icons
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Input
              placeholder="Search..."
              leftIcon={<Search />}
            />
            <Input
              placeholder="Location"
              rightIcon={<MapPin />}
            />
            <Input
              label="Email with Left Icon"
              placeholder="your@email.com"
              leftIcon={<Mail />}
            />
            <Input
              label="Name with Right Icon"
              placeholder="John Doe"
              rightIcon={<User />}
            />
          </div>
        </section>

        {/* Dropdown List Variant */}
        <section className="bg-white rounded-2xl p-8 shadow-lg space-y-6">
          <h2 className="text-2xl font-semibold text-neutral-800">
            Dropdown List Variant
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Input
              variant="list"
              label="Select City"
              placeholder="Choose a city"
              value={city}
              onChange={setCity}
              options={cities}
              leftIcon={<MapPin />}
            />
            <Input
              variant="list"
              label="Select Country"
              placeholder="Choose a country"
              options={['United States', 'Canada', 'Mexico', 'United Kingdom', 'France', 'Germany']}
            />
          </div>
          {city && (
            <div className="mt-4 p-4 bg-primary-100 rounded-lg">
              <p className="text-neutral-600">
                Selected city: <strong className="text-neutral-800">{city}</strong>
              </p>
            </div>
          )}
        </section>

        {/* States */}
        <section className="bg-white rounded-2xl p-8 shadow-lg space-y-6">
          <h2 className="text-2xl font-semibold text-neutral-800">
            Input States
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Input
              label="Normal State"
              placeholder="Type something..."
            />
            <Input
              label="With Caption"
              placeholder="Enter email"
              caption="This is a helper text"
              leftIcon={<Mail />}
            />
            <Input
              label="Loading State"
              placeholder="Processing..."
              loading={loading}
              leftIcon={<User />}
            />
            <Input
              label="Disabled State"
              placeholder="Cannot type here"
              disabled={true}
              leftIcon={<Lock />}
            />
            <Input
              label="Error State"
              placeholder="Invalid input"
              error={true}
              caption="This field is required"
              leftIcon={<Mail />}
            />
            <Input
              label="Error with Value"
              placeholder="Email"
              value="invalid-email"
              error={true}
              caption="Please enter a valid email address"
              leftIcon={<Mail />}
            />
          </div>
        </section>

        {/* Interactive Demo */}
        <section className="bg-gradient-to-r from-primary-300 to-primary-200 rounded-2xl p-8 shadow-lg space-y-6">
          <h2 className="text-2xl font-semibold text-neutral-800">
            Interactive Demo
          </h2>
          <div className="space-y-4">
            <Input
              label="Test Loading State"
              placeholder="Click button to see loading..."
              loading={loading}
              leftIcon={<Mail />}
              caption={loading ? "Loading data..." : "Click the button below to test"}
            />
            <button
              onClick={handleLoadingTest}
              disabled={loading}
              className="px-6 py-3 bg-black text-white rounded-full hover:bg-neutral-700 transition-colors disabled:bg-neutral-300 disabled:cursor-not-allowed"
            >
              {loading ? 'Loading...' : 'Test Loading State (3s)'}
            </button>
          </div>
        </section>

        {/* Error Toggle Demo */}
        <section className="bg-white rounded-2xl p-8 shadow-lg space-y-6">
          <h2 className="text-2xl font-semibold text-neutral-800">
            Error State Toggle
          </h2>
          <div className="space-y-4">
            <Input
              label="Email Validation"
              placeholder="Enter your email"
              value={email}
              onChange={setEmail}
              error={hasError}
              caption={hasError ? "Invalid email format" : "We'll never share your email"}
              leftIcon={<Mail />}
            />
            <button
              onClick={() => setHasError(!hasError)}
              className="px-6 py-3 bg-black text-white rounded-full hover:bg-neutral-700 transition-colors"
            >
              {hasError ? 'Remove Error' : 'Show Error'}
            </button>
          </div>
        </section>

        {/* Form Example */}
        <section className="bg-white rounded-2xl p-8 shadow-lg space-y-6">
          <h2 className="text-2xl font-semibold text-neutral-800">
            Form Example
          </h2>
          <form className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Input
                label="First Name"
                placeholder="John"
                leftIcon={<User />}
              />
              <Input
                label="Last Name"
                placeholder="Doe"
                leftIcon={<User />}
              />
            </div>
            <Input
              label="Email Address"
              placeholder="john.doe@example.com"
              leftIcon={<Mail />}
              caption="We'll use this for account recovery"
            />
            <Input
              variant="list"
              label="Country"
              placeholder="Select your country"
              options={['United States', 'Canada', 'United Kingdom', 'Australia', 'Germany']}
              leftIcon={<MapPin />}
            />
            <Input
              label="Phone Number"
              placeholder="+1 (555) 000-0000"
              leftIcon={<Phone />}
            />
            <button
              type="submit"
              className="w-full px-6 py-4 bg-black text-white rounded-full hover:bg-neutral-700 transition-colors font-medium"
            >
              Submit Form
            </button>
          </form>
        </section>

        {/* Usage Code */}
        <section className="bg-neutral-900 rounded-2xl p-8 shadow-lg">
          <h2 className="text-2xl font-semibold text-white mb-4">
            Usage Examples
          </h2>
          <div className="space-y-4">
            <div>
              <p className="text-neutral-400 text-sm mb-2">Basic Text Input:</p>
              <pre className="text-green-400 text-sm overflow-x-auto">
                <code>{`import { Input } from '@/components/ui';
import { Mail } from 'lucide-react';

<Input 
  label="Email" 
  placeholder="Enter email"
  leftIcon={<Mail />}
  value={email}
  onChange={setEmail}
/>`}</code>
              </pre>
            </div>
            <div>
              <p className="text-neutral-400 text-sm mb-2">Dropdown List:</p>
              <pre className="text-green-400 text-sm overflow-x-auto">
                <code>{`<Input 
  variant="list"
  label="Select City"
  placeholder="Choose a city"
  options={['Algiers', 'Oran', 'Annaba']}
  value={city}
  onChange={setCity}
/>`}</code>
              </pre>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
