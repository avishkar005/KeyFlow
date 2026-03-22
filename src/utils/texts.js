export const texts = {
  easy: [
    "The quick brown fox jumps over the lazy dog. A simple sentence that contains every letter of the alphabet at least once.",
    "Every day is a new beginning. Take a deep breath and start again. Small steps lead to great distances over time.",
    "Reading makes a full man, conference a ready man, and writing an exact man. Practice every day to improve your skills.",
    "Success is not final, failure is not fatal. It is the courage to continue that counts. Keep typing and improving.",
    "The only way to do great work is to love what you do. Find your passion and let it drive your daily practice.",
    "Patience and persistence are the two most powerful warriors. They will help you overcome any obstacle you face today.",
    "A journey of a thousand miles begins with a single step. Start your typing journey today and never look back.",
  ],
  medium: [
    "Programming is the art of telling another human being what one wants the computer to do. Clean code reads like well-written prose, where every function does one thing and does it well.",
    "The best software is built incrementally, one feature at a time, with continuous refactoring and testing. Developers who write tests first often find their designs are cleaner and more maintainable.",
    "Algorithms are the backbone of computer science, allowing us to solve complex problems efficiently. Understanding time and space complexity helps developers write more performant applications.",
    "Version control systems like Git have transformed how teams collaborate on software projects. Branching strategies and commit conventions are essential practices for any professional developer.",
    "The web is built on three fundamental technologies: HTML for structure, CSS for presentation, and JavaScript for interactivity. Mastering all three opens doors to unlimited creative possibilities.",
    "React changed the way developers think about building user interfaces by introducing a component-based architecture and a virtual DOM that makes updates efficient and predictable.",
    "TypeScript extends JavaScript by adding static types, helping developers catch errors early and write more self-documenting code that scales well across large teams and codebases.",
  ],
  hard: [
    "Asymptotic analysis provides a method for describing the efficiency of algorithms independently of hardware or implementation details. Big-O notation expresses the upper bound of time complexity as a function of input size.",
    "Functional programming paradigms emphasize immutability and pure functions, avoiding shared state and side effects. Higher-order functions, closures, and currying are fundamental concepts that enable elegant, composable solutions.",
    "Distributed systems introduce challenges around consistency, availability, and partition tolerance — the CAP theorem states you can only guarantee two of these three properties simultaneously in any distributed system.",
    "WebAssembly enables near-native performance in web browsers by providing a low-level binary instruction format that serves as a compilation target for languages like C++, Rust, and Go.",
    "Kubernetes orchestrates containerized applications across clusters of machines, handling deployment, scaling, and management automatically. Its declarative configuration model allows infrastructure to be version-controlled.",
    "The event loop is the fundamental mechanism behind JavaScript's non-blocking I/O model. Microtasks from resolved Promises are processed before macrotasks, which affects how asynchronous code executes.",
  ],
}

export const getRandomText = (difficulty = 'medium') => {
  const pool = texts[difficulty] || texts.medium
  return pool[Math.floor(Math.random() * pool.length)]
}

export const quotes = [
  { text: "The more that you read, the more things you will know.", author: "Dr. Seuss" },
  { text: "Practice makes perfect, but nobody is perfect, so why practice?", author: "Billy Joe" },
  { text: "Speed is irrelevant if you are going in the wrong direction.", author: "Mahatma Gandhi" },
  { text: "It does not matter how slowly you go as long as you do not stop.", author: "Confucius" },
]
