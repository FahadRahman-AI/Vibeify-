"use client";

export function AnimatedBackground() {
  return (
    <div className="fixed inset-0 -z-10 bg-gradient-to-br from-purple-900 via-black to-blue-900 animate-gradient">
      <div className="absolute inset-0 backdrop-blur-3xl opacity-20"></div>
    </div>
  );
}
