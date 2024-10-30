'use client'
import { useState } from 'react'
//@ts-ignore
import axios from 'axios'
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { useRouter } from 'next/navigation'

export default function SignInPage() {
  const router = useRouter()
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  })
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    
    try {
      const response = await axios.post('https://internal.c98staging.dev/api/user/login_09392983', {
        id: formData.email,
        password: formData.password
      })
      
      const { code } = response.data
      localStorage.setItem('jwt_adapter', code)
      localStorage.setItem('jwt', code)
      
      router.push('/')
    } catch (error) {
      console.error('Login failed:', error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <main className="min-h-screen flex items-center justify-center bg-black">
      <div className="w-full max-w-md p-8 space-y-6 rounded-lg bg-black/50 backdrop-blur-sm">

        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            type="email"
            placeholder="Email"
            value={formData.email}
            onChange={(e) => setFormData(prev => ({...prev, email: e.target.value}))}
            className="bg-gray-800/50 border-gray-700"
            disabled={isLoading}
            required
          />
          <Input
            type="password"
            placeholder="Password"
            value={formData.password}
            onChange={(e) => setFormData(prev => ({...prev, password: e.target.value}))}
            className="bg-gray-800/50 border-gray-700"
            disabled={isLoading}
            required
          />
          <Button 
            type="submit" 
            className="w-full bg-yellow-400 hover:bg-yellow-500 text-black font-semibold"
            disabled={isLoading}
          >
            {isLoading ? 'Signing in...' : 'Sign In'}
          </Button>
        </form>
      </div>
    </main>
  )
}
