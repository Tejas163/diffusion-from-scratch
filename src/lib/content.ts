export interface Lesson {
  id: string;
  title: string;
  description: string;
  duration: string;
}

export interface Module {
  id: string;
  title: string;
  description: string;
  lessons: Lesson[];
  completed?: boolean;
}

export const modules: Module[] = [
  {
    id: '1-transformer-foundations',
    title: 'Transformer Foundations',
    description: 'Master the architecture that powers modern language models. Understanding transformers is essential before diving into diffusion.',
    lessons: [
      {
        id: '1-1-attention-mechanism',
        title: 'The Attention Mechanism',
        description: 'Understand self-attention: how models learn relationships between all tokens simultaneously.',
        duration: '20 min',
      },
      {
        id: '1-2-positional-encoding',
        title: 'Positional Encoding',
        description: 'Learn how transformers understand word order without recurrence.',
        duration: '15 min',
      },
      {
        id: '1-3-feed-forward-layers',
        title: 'Feed-Forward Networks',
        description: 'Deep dive into the MLP layers that give transformers their capacity.',
        duration: '15 min',
      },
      {
        id: '1-4-building-blocks',
        title: 'Building a Transformer Block',
        description: 'Put it all together: attention + feed-forward + residual connections.',
        duration: '25 min',
      },
      {
        id: '1-5-full-transformer',
        title: 'Full Transformer Architecture',
        description: 'Build a complete transformer with embeddings, layers, and output projection.',
        duration: '30 min',
      },
    ],
  },
  {
    id: '2-discrete-diffusion-theory',
    title: 'Discrete Diffusion Theory',
    description: 'Learn why we need diffusion for text and how discrete noise differs from continuous Gaussian noise.',
    lessons: [
      {
        id: '2-1-why-diffusion-for-text',
        title: 'Why Diffusion for Text?',
        description: 'Compare autoregressive vs diffusion-based generation. Why parallel sampling matters.',
        duration: '20 min',
      },
      {
        id: '2-2-discrete-vs-continuous',
        title: 'Discrete vs Continuous Noise',
        description: 'Text is discrete tokens, not continuous pixels. How do we noise discrete data?',
        duration: '25 min',
      },
      {
        id: '2-3-forward-process',
        title: 'The Forward Noising Process',
        description: 'Step by step: how we progressively mask tokens for training.',
        duration: '20 min',
      },
      {
        id: '2-4-reverse-process',
        title: 'The Reverse Denoising Process',
        description: 'Learning to reconstruct original tokens from corrupted inputs.',
        duration: '25 min',
      },
    ],
  },
  {
    id: '3-masked-diffusion-lm',
    title: 'Masked Diffusion LM (MDLM)',
    description: 'The core innovation behind Mercury. Learn the masked diffusion objective that enables parallel generation.',
    lessons: [
      {
        id: '3-1-mdm-intuition',
        title: 'MDM Intuition',
        description: 'An intuitive understanding of masked diffusion language models.',
        duration: '15 min',
      },
      {
        id: '3-2-rao-blackwellized-loss',
        title: 'Rao-Blackwellized Loss',
        description: 'The statistical trick that makes MDM training efficient and effective.',
        duration: '30 min',
      },
      {
        id: '3-3-implementation',
        title: 'Implementing MDLM',
        description: 'Code a masked diffusion model from scratch in PyTorch.',
        duration: '45 min',
      },
      {
        id: '3-4-training-loop',
        title: 'Training the Model',
        description: 'Set up the training pipeline with data loading and optimization.',
        duration: '30 min',
      },
      {
        id: '3-5-mini-project',
        title: 'Mini Project: Tiny MDLM',
        description: 'Train a small masked diffusion model on Shakespeare text.',
        duration: '60 min',
      },
    ],
  },
  {
    id: '4-sampling-strategies',
    title: 'Sampling Strategies',
    description: 'How do we generate text? Compare different decoding strategies for diffusion models.',
    lessons: [
      {
        id: '4-1-multistep-sampling',
        title: 'Multistep Sampling',
        description: 'Iteratively refine tokens over multiple denoising steps.',
        duration: '25 min',
      },
      {
        id: '4-2-greedysampling',
        title: 'Greedy vs Random Sampling',
        description: 'When to take the highest probability token vs sampling.',
        duration: '15 min',
      },
      {
        id: '4-3-temperatur-topk-topp',
        title: 'Temperature, Top-K, Top-P',
        description: 'Advanced sampling techniques for controlling generation diversity.',
        duration: '20 min',
      },
    ],
  },
  {
    id: '5-scaling-training',
    title: 'Scaling & Training',
    description: 'What does it take to scale MDLM to billions of parameters? Training dynamics and optimizations.',
    lessons: [
      {
        id: '5-1-scaling-laws',
        title: 'Scaling Laws for Diffusion LMs',
        description: 'How model size, data, and compute affect performance.',
        duration: '25 min',
      },
      {
        id: '5-2-efficient-attention',
        title: 'Efficient Attention Patterns',
        description: 'Flash Attention, sliding window, and sparse attention for long contexts.',
        duration: '30 min',
      },
      {
        id: '5-3-mixed-precision',
        title: 'Mixed Precision Training',
        description: 'FP16/BF16 training for memory efficiency and speed.',
        duration: '20 min',
      },
      {
        id: '5-4-distributed-training',
        title: 'Distributed Training',
        description: 'Data and model parallelism for large-scale training.',
        duration: '35 min',
      },
    ],
  },
  {
    id: '6-conditioning-guidance',
    title: 'Conditioning & Guidance',
    description: 'How do we make diffusion models follow instructions and generate relevant text?',
    lessons: [
      {
        id: '6-1-conditiong-intro',
        title: 'Conditioning Basics',
        description: 'How to condition generation on prompts and instructions.',
        duration: '20 min',
      },
      {
        id: '6-2-cfg',
        title: 'Classifier-Free Guidance',
        description: 'The technique that powers modern text generation without classifiers.',
        duration: '25 min',
      },
      {
        id: '6-3-implementation',
        title: 'CFG Implementation',
        description: 'Add CFG to your diffusion model for better prompt adherence.',
        duration: '30 min',
      },
    ],
  },
  {
    id: '7-mercury-architecture',
    title: 'Mercury Architecture',
    description: 'Deep dive into Inception Labs Mercury: the production-grade diffusion LLM.',
    lessons: [
      {
        id: '7-1-mercury-overview',
        title: 'Mercury Overview',
        description: 'Architecture overview and key innovations of Mercury.',
        duration: '20 min',
      },
      {
        id: '7-2-discrete-embedding',
        title: 'Discrete State Spaces',
        description: 'How Mercury handles discrete token spaces efficiently.',
        duration: '25 min',
      },
      {
        id: '7-3-inference-optimization',
        title: 'Inference Optimization',
        description: 'Techniques for ultra-fast parallel generation.',
        duration: '30 min',
      },
      {
        id: '7-4-replicating-mercury',
        title: 'Building a Mercury Clone',
        description: 'Implement a simplified Mercury-style model.',
        duration: '60 min',
      },
    ],
  },
  {
    id: '8-evaluation',
    title: 'Evaluation',
    description: 'How do we measure the quality of diffusion language models?',
    lessons: [
      {
        id: '8-1-perplexity',
        title: 'Perplexity & Likelihood',
        description: 'Standard metrics for language model evaluation.',
        duration: '20 min',
      },
      {
        id: '8-2-downstream-tasks',
        title: 'Downstream Task Evaluation',
        description: 'Benchmarking on reasoning, question answering, and more.',
        duration: '25 min',
      },
      {
        id: '8-3-human-evaluation',
        title: 'Human Evaluation & Win Rates',
        description: 'Chatbot Arena, ELO ratings, and human preference metrics.',
        duration: '20 min',
      },
    ],
  },
];

export function getModule(id: string): Module | undefined {
  return modules.find(m => m.id === id);
}

export function getLesson(moduleId: string, lessonId: string) {
  const module = getModule(moduleId);
  return module?.lessons.find(l => l.id === lessonId);
}
