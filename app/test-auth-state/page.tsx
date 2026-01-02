'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabaseClient';
import { useAuth } from '@/hooks/useAuth';
import { User } from '@supabase/supabase-js';

export default function TestAuthState() {
  const { user, loading } = useAuth();
  const [directUser, setDirectUser] = useState<User | null>(null);
  const [sessionData, setSessionData] = useState<Record<string, unknown> | null>(null);
  const [localStorageData, setLocalStorageData] = useState<Record<string, unknown> | null>(null);

  useEffect(() => {
    // Test direct Supabase call
    const checkSession = async () => {
      const { data, error } = await supabase.auth.getSession();
      if (error) {
        setSessionData({ error: error.message });
      } else {
        setSessionData(data as Record<string, unknown>);
      }
      setDirectUser(data.session?.user || null);

      // Check localStorage
      if (typeof window !== 'undefined') {
        const allKeys = Object.keys(localStorage);
        const storageData: Record<string, unknown> = {
          totalKeys: allKeys.length,
          allKeys: allKeys,
          data: {} as Record<string, unknown>
        };
        allKeys.forEach(key => {
          try {
            const value = localStorage.getItem(key);
            (storageData.data as Record<string, unknown>)[key] = value && value.length < 500 ? JSON.parse(value) : 'Value too long or invalid JSON';
          } catch {
            (storageData.data as Record<string, unknown>)[key] = localStorage.getItem(key);
          }
        });
        setLocalStorageData(storageData);
      }
    };

    checkSession();
  }, []);

  return (
    <div className="min-h-screen p-8 bg-gray-50">
      <div className="max-w-4xl mx-auto space-y-6">
        <h1 className="text-3xl font-bold">Auth State Diagnostic</h1>
        
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-4">useAuth Hook</h2>
          <div className="space-y-2">
            <p><strong>Loading:</strong> {loading ? 'Yes' : 'No'}</p>
            <p><strong>User:</strong> {user ? user.email : 'Not logged in'}</p>
            <pre className="bg-gray-100 p-4 rounded overflow-auto text-xs">
              {JSON.stringify(user, null, 2)}
            </pre>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-4">Direct Supabase Session</h2>
          <div className="space-y-2">
            <p><strong>User:</strong> {directUser ? directUser.email : 'Not logged in'}</p>
            <pre className="bg-gray-100 p-4 rounded overflow-auto text-xs">
              {JSON.stringify(sessionData, null, 2)}
            </pre>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-4">LocalStorage Data</h2>
          <pre className="bg-gray-100 p-4 rounded overflow-auto text-xs">
            {JSON.stringify(localStorageData, null, 2)}
          </pre>
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-4">Environment Variables</h2>
          <div className="space-y-2">
            <p><strong>NEXT_PUBLIC_SUPABASE_URL:</strong> {process.env.NEXT_PUBLIC_SUPABASE_URL || 'Not set'}</p>
            <p><strong>NEXT_PUBLIC_SUPABASE_ANON_KEY:</strong> {process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ? 'Set (hidden)' : 'Not set'}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
