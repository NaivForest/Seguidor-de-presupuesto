import { PiggyBank, Landmark } from 'lucide-react'
import React from 'react'

function Logo() {
  return (
    <a href='/' className='flex items-center gap-2'>
        <Landmark className='stroke h-11 w-11 stroke-green-600 stroke-[1.5]' />
        <p className="bg-gradient-to-r from-blue-300 to-green-600 bg-clip-text text-3xl font-bold leading-tight tracking-tighter text-transparent">
            Monitor de Presupuesto
        </p>
    </a>
  )
}

export function LogoMobile() {
  return (
    <a href='/' className='flex items-center gap-2'>
        <Landmark className='stroke h-11 w-11 stroke-green-600 stroke-[1.5]' />
        <p className="bg-gradient-to-r from-blue-300 to-green-600 bg-clip-text text-3xl font-bold leading-tight tracking-tighter text-transparent">
            Presupuesto
        </p>
    </a>
  )
}

export default Logo