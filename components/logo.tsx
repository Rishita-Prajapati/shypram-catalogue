"use client"

import React from 'react'
import Image from 'next/image'

interface LogoProps {
  className?: string
  width?: number
  height?: number
}

export function Logo({ className = "", width = 40, height = 40 }: LogoProps) {
  return (
    <div className={`bg-white rounded-sm p-1 ${className}`}>
      <Image
        src="/shypram-catalogue/LOGO.png"
        alt="Shypram Rubber Profile Pvt. Ltd. Logo"
        width={width}
        height={height}
        priority
      />
    </div>
  )
}