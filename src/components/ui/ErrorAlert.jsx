import { useState, useEffect } from 'react';
import { X, AlertCircle, Copy } from 'lucide-react';

export default function ErrorAlert({ error, onClose, autoClose = 5000 }) {
  const [isVisible, setIsVisible] = useState(true)
  const [copied, setCopied] = useState(false)

  useEffect(() => {
    if (autoClose && isVisible) {
      const timer = setTimeout(() => {
        setIsVisible(false)
        onClose?.()
      }, autoClose)

      return () => clearTimeout(timer)
    }
  }, [autoClose, isVisible, onClose])

  const handleClose = () => {
    setIsVisible(false)
    onClose?.()
  }

  const handleCopy = async () => {
    try {
      await navigator.clipboard?.writeText(error)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (err) {
      // Fallback for older browsers
      const textArea = document.createElement('textarea')
      textArea.value = error
      document.body?.appendChild(textArea)
      textArea?.select()
      document.execCommand('copy')
      document.body?.removeChild(textArea)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }
  }

  if (!error || !isVisible) return null

  return (
    <div className="fixed top-4 right-4 max-w-md w-full bg-red-50 border border-red-200 rounded-lg p-4 shadow-lg z-50">
      <div className="flex items-start">
        <div className="flex-shrink-0">
          <AlertCircle className="h-5 w-5 text-red-400" />
        </div>
        <div className="ml-3 flex-1">
          <h3 className="text-sm font-medium text-red-800">
            Error
          </h3>
          <div className="mt-2 text-sm text-red-700">
            <p>{error}</p>
          </div>
          <div className="mt-3 flex space-x-2">
            <button
              type="button"
              onClick={handleCopy}
              className="inline-flex items-center px-2 py-1 border border-transparent text-xs font-medium rounded text-red-700 bg-red-100 hover:bg-red-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
            >
              <Copy className="h-3 w-3 mr-1" />
              {copied ? 'Copied!' : 'Copy Error'}
            </button>
          </div>
        </div>
        <div className="ml-auto pl-3">
          <div className="-mx-1.5 -my-1.5">
            <button
              type="button"
              onClick={handleClose}
              className="inline-flex bg-red-50 rounded-md p-1.5 text-red-500 hover:bg-red-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-red-50 focus:ring-red-600"
            >
              <span className="sr-only">Dismiss</span>
              <X className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}