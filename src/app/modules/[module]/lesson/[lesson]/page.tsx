import Link from 'next/link';
import { notFound } from 'next/navigation';
import { modules, getLesson, getModule } from '@/lib/content';
import { ArrowLeft, ArrowRight, Clock, BookOpen, Play, Copy, CheckCircle } from 'lucide-react';

export function generateStaticParams() {
  const paths: { module: string; lesson: string }[] = [];
  modules.forEach((module) => {
    module.lessons.forEach((lesson) => {
      paths.push({ module: module.id, lesson: lesson.id });
    });
  });
  return paths;
}

export default async function LessonPage({ 
  params 
}: { 
  params: Promise<{ module: string; lesson: string }> 
}) {
  const { module: moduleId, lesson: lessonId } = await params;
  const module = getModule(moduleId);
  const lesson = getLesson(moduleId, lessonId);

  if (!module || !lesson) {
    notFound();
  }

  const lessonIndex = module.lessons.findIndex(l => l.id === lesson.id);
  const prevLesson = lessonIndex > 0 ? module.lessons[lessonIndex - 1] : null;
  const nextLesson = lessonIndex < module.lessons.length - 1 
    ? module.lessons[lessonIndex + 1] 
    : modules[modules.findIndex(m => m.id === module.id) + 1]?.lessons[0];

  const moduleIndex = modules.findIndex(m => m.id === module.id) + 1;

  return (
    <div className="min-h-screen">
      <header className="border-b border-zinc-800 sticky top-0 bg-zinc-950/80 backdrop-blur z-50">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link href={`/modules/${module.id}`} className="text-zinc-400 hover:text-white transition flex items-center gap-2">
            <ArrowLeft className="w-4 h-4" />
            <span className="hidden sm:inline">{module.title}</span>
          </Link>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 text-zinc-500">
              <Clock className="w-4 h-4" />
              <span className="text-sm">{lesson.duration}</span>
            </div>
            <button className="px-3 py-1.5 text-sm bg-yellow-500/10 text-yellow-500 rounded-lg hover:bg-yellow-500/20 transition flex items-center gap-2">
              <Play className="w-4 h-4" />
              Run Code
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-6 py-12">
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-4">
            <span className="px-2 py-1 text-xs bg-yellow-500/10 text-yellow-500 rounded">
              Module {moduleIndex}
            </span>
            <span className="text-zinc-500">Lesson {lessonIndex + 1}</span>
          </div>
          <h1 className="text-4xl font-bold">{lesson.title}</h1>
          <p className="text-zinc-400 text-lg mt-4">{lesson.description}</p>
        </div>

        <div className="prose prose-invert prose-zinc max-w-none">
          {renderLessonContent(lesson.id, module.id)}
        </div>

        <div className="mt-12 p-6 bg-zinc-900/50 rounded-xl border border-zinc-800">
          <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-yellow-500" />
            Key Takeaways
          </h3>
          {getKeyTakeaways(lesson.id)}
        </div>

        <div className="mt-16 pt-8 border-t border-zinc-800 flex justify-between">
          {prevLesson ? (
            <Link
              href={`/modules/${module.id}/lesson/${prevLesson.id}`}
              className="flex items-center gap-2 text-zinc-400 hover:text-white transition"
            >
              <ArrowLeft className="w-4 h-4" />
              <div className="text-right">
                <div className="text-sm text-zinc-500">Previous</div>
                <div>{prevLesson.title}</div>
              </div>
            </Link>
          ) : (
            <div />
          )}
          
          {nextLesson && (
            <Link
              href={`/modules/${module.id}/lesson/${nextLesson.id}`}
              className="flex items-center gap-2 text-zinc-400 hover:text-white transition"
            >
              <div className="text-left">
                <div className="text-sm text-zinc-500">Next</div>
                <div>{nextLesson.title}</div>
              </div>
              <ArrowRight className="w-4 h-4" />
            </Link>
          )}
        </div>
      </main>
    </div>
  );
}

function CodeBlock({ children, language = 'python' }: { children: string; language?: string }) {
  return (
    <div className="my-6 rounded-xl overflow-hidden border border-zinc-800">
      <div className="bg-zinc-800 px-4 py-2 flex items-center justify-between text-xs text-zinc-400">
        <span>{language}</span>
        <button className="hover:text-white transition flex items-center gap-1">
          <Copy className="w-3 h-3" />
          Copy
        </button>
      </div>
      <pre className="bg-zinc-900 p-4 overflow-x-auto">
        <code className="text-green-400 text-sm font-mono">{children}</code>
      </pre>
    </div>
  );
}

function InfoBox({ title, children, type = 'info' }: { title: string; children: React.ReactNode; type?: 'info' | 'warning' | 'success' }) {
  const colors = {
    info: 'border-blue-500/50 bg-blue-500/10',
    warning: 'border-yellow-500/50 bg-yellow-500/10',
    success: 'border-green-500/50 bg-green-500/10',
  };
  return (
    <div className={`my-6 p-4 rounded-lg border ${colors[type]}`}>
      <h4 className="font-semibold mb-2">{title}</h4>
      <div className="text-zinc-300">{children}</div>
    </div>
  );
}

function renderLessonContent(lessonId: string, moduleId: string) {
  const content = lessonContent[lessonId];
  if (!content) {
    return (
      <div className="text-center py-20">
        <BookOpen className="w-16 h-16 text-zinc-700 mx-auto mb-4" />
        <h2 className="text-2xl font-bold mb-2">Lesson Coming Soon</h2>
        <p className="text-zinc-500">
          This lesson is being developed. Check back soon for full content!
        </p>
      </div>
    );
  }
  return content;
}

function getKeyTakeaways(lessonId: string) {
  const takeaways: Record<string, JSX.Element> = {
    '1-1-attention-mechanism': (
      <ul className="space-y-2 text-zinc-300">
        <li className="flex items-start gap-2"><CheckCircle className="w-4 h-4 text-green-500 mt-1 shrink-0" /> Self-attention allows parallel computation of token relationships</li>
        <li className="flex items-start gap-2"><CheckCircle className="w-4 h-4 text-green-500 mt-1 shrink-0" /> Q, K, V projections enable learned "what to look for" and "what to return"</li>
        <li className="flex items-start gap-2"><CheckCircle className="w-4 h-4 text-green-500 mt-1 shrink-0" /> Multi-head attention captures different types of relationships simultaneously</li>
      </ul>
    ),
    '1-2-positional-encoding': (
      <ul className="space-y-2 text-zinc-300">
        <li className="flex items-start gap-2"><CheckCircle className="w-4 h-4 text-green-500 mt-1 shrink-0" /> Attention is permutation invariant—position must be encoded explicitly</li>
        <li className="flex items-start gap-2"><CheckCircle className="w-4 h-4 text-green-500 mt-1 shrink-0" /> Sinusoidal encoding can represent any position, even beyond training length</li>
        <li className="flex items-start gap-2"><CheckCircle className="w-4 h-4 text-green-500 mt-1 shrink-0" /> Modern models often use RoPE or ALiBi instead</li>
      </ul>
    ),
  };
  return takeaways[lessonId] || (
    <p className="text-zinc-500">Key takeaways coming soon for this lesson.</p>
  );
}

const lessonContent: Record<string, React.ReactNode> = {
  // Module 1: Transformer Foundations
  '1-1-attention-mechanism': (
    <>
      <h2>What is Attention?</h2>
      <p>
        The attention mechanism is the heart of modern language models. It allows every token 
        to &ldquo;attend to&rdquo; (look at) every other token, learning relationships regardless of distance.
      </p>

      <h3>The Intuition</h3>
      <p>
        Imagine reading: &ldquo;The cat sat on the mat because it was tired.&rdquo; How do you know 
        &ldquo;it&rdquo; refers to &ldquo;cat&rdquo;? Your brain implicitly attends to &ldquo;cat&rdquo; when processing &ldquo;it&rdquo;. 
        Attention is the mathematical version of this.
      </p>

      <InfoBox title="Key Insight" type="info">
        Unlike RNNs which process sequentially, attention allows all positions to 
        interact with all others in parallel!
      </InfoBox>

      <h3>The Math</h3>
      <p>Attention computes a weighted sum where weights are based on query-key similarity:</p>

      <CodeBlock language="math">
{`Attention(Q, K, V) = softmax(QK^T / √d_k)V

Where:
• Q (Query): What am I looking for?
• K (Key): What do I contain?
• V (Value): What information do I have?
• d_k: Dimension of keys (scaling factor)`}
      </CodeBlock>

      <h3>PyTorch Implementation</h3>
      <CodeBlock language="python">
{`import torch
import torch.nn as nn
import torch.nn.functional as F
import math

def scaled_dot_product_attention(Q, K, V, mask=None):
    """
    Compute scaled dot-product attention.
    
    Args:
        Q: (batch, num_heads, seq_len, d_k)
        K: (batch, num_heads, seq_len, d_k)
        V: (batch, num_heads, seq_len, d_v)
        mask: Optional attention mask
    Returns:
        output: (batch, num_heads, seq_len, d_v)
        attention_weights: (batch, num_heads, seq_len, seq_len)
    """
    d_k = Q.size(-1)
    
    # Compute attention scores
    scores = torch.matmul(Q, K.transpose(-2, -1)) / math.sqrt(d_k)
    
    # Apply mask if provided
    if mask is not None:
        scores = scores.masked_fill(mask == 0, float('-inf'))
    
    # Softmax to get weights
    attention_weights = F.softmax(scores, dim=-1)
    
    # Weighted sum of values
    output = torch.matmul(attention_weights, V)
    
    return output, attention_weights

class MultiHeadAttention(nn.Module):
    def __init__(self, d_model, num_heads):
        super().__init__()
        assert d_model % num_heads == 0
        
        self.d_model = d_model
        self.num_heads = num_heads
        self.d_k = d_model // num_heads
        
        # Learned projections
        self.W_q = nn.Linear(d_model, d_model)
        self.W_k = nn.Linear(d_model, d_model)
        self.W_v = nn.Linear(d_model, d_model)
        self.W_o = nn.Linear(d_model, d_model)
    
    def forward(self, x, mask=None):
        batch, seq_len, _ = x.shape
        
        # Linear projections and reshape for multi-head
        Q = self.W_q(x).view(batch, seq_len, self.num_heads, self.d_k).transpose(1, 2)
        K = self.W_k(x).view(batch, seq_len, self.num_heads, self.d_k).transpose(1, 2)
        V = self.W_v(x).view(batch, seq_len, self.num_heads, self.d_k).transpose(1, 2)
        
        # Compute attention
        attn_output, attn_weights = scaled_dot_product_attention(Q, K, V, mask)
        
        # Concatenate heads
        attn_output = attn_output.transpose(1, 2).contiguous()
        attn_output = attn_output.view(batch, seq_len, self.d_model)
        
        # Final linear projection
        output = self.W_o(attn_output)
        
        return output

# Test implementation
batch_size, seq_len, d_model, num_heads = 2, 10, 64, 8
x = torch.randn(batch_size, seq_len, d_model)
attention = MultiHeadAttention(d_model, num_heads)
output = attention(x)
print(f"Output shape: {output.shape}")  # (2, 10, 64)`}
      </CodeBlock>

      <h3>Try It Yourself</h3>
      <ul>
        <li>Visualize attention weights with <code>torch.matmul</code> outputs</li>
        <li>Experiment with different numbers of heads</li>
        <li>Add a causal mask to prevent attending to future tokens</li>
      </ul>

      <InfoBox title="Exercise" type="success">
        Modify the code to return attention weights and visualize them using matplotlib.
        Can you find which heads attend to local context vs. long-range dependencies?
      </InfoBox>
    </>
  ),

  '1-2-positional-encoding': (
    <>
      <h2>Why Positional Encoding?</h2>
      <p>
        Attention is <strong>permutation invariant</strong>—it treats input as a bag of tokens. 
        &ldquo;The cat bit the dog&rdquo; and &ldquo;The dog bit the cat&rdquo; get identical representations!
      </p>
      <p>
        Positional encoding adds position information so the model can distinguish 
        &ldquo;first&rdquo; from &ldquo;second&rdquo;, &ldquo;before&rdquo; from &ldquo;after&rdquo;.
      </p>

      <h3>Sinusoidal Positional Encoding</h3>
      <p>The original Transformer uses sine/cosine waves at different frequencies:</p>

      <CodeBlock language="python">
{`import torch
import torch.nn as nn
import math

class PositionalEncoding(nn.Module):
    def __init__(self, d_model, max_len=5000):
        super().__init__()
        
        # Create positional encoding matrix
        pe = torch.zeros(max_len, d_model)
        position = torch.arange(0, max_len, dtype=torch.float).unsqueeze(1)
        
        # Frequency bands
        div_term = torch.exp(
            torch.arange(0, d_model, 2).float() * 
            (-math.log(10000.0) / d_model)
        )
        
        # Apply sin to even indices, cos to odd indices
        pe[:, 0::2] = torch.sin(position * div_term)
        pe[:, 1::2] = torch.cos(position * div_term)
        
        # Register as buffer (not a learnable parameter)
        self.register_buffer('pe', pe.unsqueeze(0))
    
    def forward(self, x):
        """x: (batch, seq_len, d_model)"""
        return x + self.pe[:, :x.size(1)]

# Example usage
d_model = 512
seq_len = 100
pe = PositionalEncoding(d_model, max_len=seq_len)

x = torch.randn(2, seq_len, d_model)
x_encoded = pe(x)
print(f"Input shape: {x.shape}")
print(f"Output shape: {x_encoded.shape}")`}
      </CodeBlock>

      <h3>Why Sinusoids Work</h3>
      <ul>
        <li><strong>Generalization</strong>: Can encode positions beyond training length</li>
        <li><strong>Relative positions</strong>: Sinusoids encode relative distance naturally</li>
        <li><strong>No parameters</strong>: Fixed encoding means no extra training cost</li>
      </ul>

      <h3>Modern Alternatives</h3>
      <p>
        Most modern models use alternatives like <strong>RoPE (Rotary Position Embedding)</strong> 
        or <strong>ALiBi</strong> which we&apos;ll cover in later modules.
      </p>

      <InfoBox title="Coming Up" type="info">
        In Module 5, we&apos;ll learn about RoPE—a rotation-based approach that&apos;s 
        become the de facto standard in open-source models like LLaMA.
      </InfoBox>
    </>
  ),

  '1-3-feed-forward-layers': (
    <>
      <h2>The Feed-Forward Network</h2>
      <p>
        Each transformer block contains a feed-forward network (FFN) that processes 
        each position identically. Despite its simplicity, it&apos;s crucial for model capacity.
      </p>

      <CodeBlock language="python">
{`import torch
import torch.nn as nn

class FeedForward(nn.Module):
    def __init__(self, d_model, d_ff, dropout=0.1):
        super().__init__()
        # Expand dimensions: d_model -> d_ff (typically 4x)
        self.linear1 = nn.Linear(d_model, d_ff)
        # Contract back: d_ff -> d_model
        self.linear2 = nn.Linear(d_ff, d_model)
        self.dropout = nn.Dropout(dropout)
        self.activation = nn.GELU()  # Better than ReLU, used in GPT/BERT
    
    def forward(self, x):
        # x: (batch, seq_len, d_model)
        x = self.linear1(x)          # (batch, seq_len, d_ff)
        x = self.activation(x)       # Non-linear activation
        x = self.dropout(x)
        x = self.linear2(x)          # (batch, seq_len, d_model)
        return x

# Typical sizing: d_ff = 4 * d_model
d_model = 512
d_ff = 2048
ffn = FeedForward(d_model, d_ff)
print(f"FFN parameters: {sum(p.numel() for p in ffn.parameters()):,}")`}
      </CodeBlock>

      <h3>Why GELU?</h3>
      <p>
        GELU (Gaussian Error Linear Unit) is smoother than ReLU and has non-zero gradients 
        for negative inputs. GPT models use it, and it often outperforms ReLU.
      </p>

      <CodeBlock language="python">
{`# Compare activations
import matplotlib.pyplot as plt
import torch

x = torch.linspace(-4, 4, 100)

relu = torch.nn.ReLU()(x)
gelu = torch.nn.GELU()(x)

# GELU smoothly approaches 0 for negative values
# ReLU hard-cuts at 0`}
      </CodeBlock>

      <h3>The &ldquo;Memory&rdquo; Theory</h3>
      <p>
        Some researchers view FFN layers as key-value memories: the first linear acts as 
        keys (addresses) and the second as values (content). This explains why scaling FFN 
        size dramatically increases model capacity.
      </p>

      <InfoBox title="Memory Footprint" type="warning">
        FFN layers account for ~2/3 of transformer parameters! In a 7B model, 
        about 4.6B parameters are in FFN layers.
      </InfoBox>
    </>
  ),

  '1-4-building-blocks': (
    <>
      <h2>Building a Transformer Block</h2>
      <p>A transformer block combines:</p>
      <ol>
        <li>Multi-head self-attention</li>
        <li>Add &amp; Norm (residual + layer normalization)</li>
        <li>Feed-forward network</li>
        <li>Add &amp; Norm</li>
      </ol>

      <CodeBlock language="python">
{`import torch
import torch.nn as nn
import torch.nn.functional as F
import math

class TransformerBlock(nn.Module):
    def __init__(self, d_model, num_heads, d_ff, dropout=0.1):
        super().__init__()
        
        self.attention = MultiHeadAttention(d_model, num_heads)
        self.norm1 = nn.LayerNorm(d_model)
        self.norm2 = nn.LayerNorm(d_model)
        self.ffn = FeedForward(d_model, d_ff, dropout)
        self.dropout = nn.Dropout(dropout)
    
    def forward(self, x, mask=None):
        # Self-attention with residual connection
        # "Sub-layer" is wrapped inside residual
        attn_output = self.attention(self.norm1(x), mask)
        x = x + self.dropout(attn_output)
        
        # Feed-forward with residual connection
        ffn_output = self.ffn(self.norm2(x))
        x = x + self.dropout(ffn_output)
        
        return x

# Create a small transformer block for testing
d_model = 256
num_heads = 8
d_ff = 1024
block = TransformerBlock(d_model, num_heads, d_ff)

x = torch.randn(2, 50, d_model)  # Batch of 2, seq_len=50
output = block(x)
print(f"Block output shape: {output.shape}")  # (2, 50, 256)`}
      </CodeBlock>

      <h3>Key Components</h3>
      <ul>
        <li><strong>LayerNorm</strong>: Normalizes over features, not batch. More stable for sequences.</li>
        <li><strong>Residual connections</strong>: Enable deep networks by letting gradients flow directly.</li>
        <li><strong>Dropout</strong>: Regularization during training; disabled at inference.</li>
      </ul>

      <InfoBox title="Depth Matters" type="success">
        ResNets showed that residual connections are essential for training very deep networks.
        Transformers with 100+ layers are standard today thanks to this insight.
      </InfoBox>
    </>
  ),

  '1-5-full-transformer': (
    <>
      <h2>The Full Transformer</h2>
      <p>Let&apos;s build a complete encoder transformer (like BERT) from scratch:</p>

      <CodeBlock language="python">
{`import torch
import torch.nn as nn
import math

class TransformerEncoder(nn.Module):
    def __init__(
        self,
        vocab_size,
        d_model=512,
        num_heads=8,
        num_layers=6,
        d_ff=2048,
        max_len=5000,
        dropout=0.1
    ):
        super().__init__()
        
        # Token embeddings with scaling
        self.token_embedding = nn.Embedding(vocab_size, d_model)
        self.pos_encoding = PositionalEncoding(d_model, max_len)
        
        # Stack of transformer blocks
        self.blocks = nn.ModuleList([
            TransformerBlock(d_model, num_heads, d_ff, dropout)
            for _ in range(num_layers)
        ])
        
        # Output projection
        self.output_projection = nn.Linear(d_model, vocab_size)
        self.dropout = nn.Dropout(dropout)
        
        self.d_model = d_model
        self._init_weights()
    
    def _init_weights(self):
        # Initialize weights
        for p in self.parameters():
            if p.dim() > 1:
                nn.init.xavier_uniform_(p)
    
    def forward(self, x, mask=None):
        """
        x: (batch, seq_len) - token indices
        Returns: (batch, seq_len, vocab_size) - logits
        """
        # Embed tokens and scale
        x = self.token_embedding(x) * math.sqrt(self.d_model)
        x = self.pos_encoding(x)
        x = self.dropout(x)
        
        # Pass through transformer blocks
        for block in self.blocks:
            x = block(x, mask)
        
        # Project to vocabulary
        logits = self.output_projection(x)
        
        return logits

# Example: Small transformer
VOCAB_SIZE = 30000
model = TransformerEncoder(
    vocab_size=VOCAB_SIZE,
    d_model=256,
    num_heads=8,
    num_layers=6,
    d_ff=1024
)

# Test forward pass
batch_size = 4
seq_len = 32
x = torch.randint(0, VOCAB_SIZE, (batch_size, seq_len))
logits = model(x)
print(f"Input shape: {x.shape}")
print(f"Output shape: {logits.shape}")  # (4, 32, 30000)
print(f"Parameters: {sum(p.numel() for p in model.parameters()):,}")`}
      </CodeBlock>

      <h3>Training the Model</h3>
      <CodeBlock language="python">
{`# Cross-entropy loss for next-token prediction
criterion = nn.CrossEntropyLoss()

def train_step(model, batch, optimizer):
    model.train()
    input_ids, labels = batch
    
    # Forward pass
    logits = model(input_ids)
    
    # Compute loss (shift for causal LM)
    # Predict next token given current
    loss = criterion(
        logits.view(-1, logits.size(-1)),  # (batch*seq, vocab)
        labels.view(-1)                       # (batch*seq)
    )
    
    # Backward pass
    loss.backward()
    optimizer.step()
    optimizer.zero_grad()
    
    return loss.item()

# Loss: "Cross-entropy is just log-likelihood!"
# Minimizing -log(probability of correct token) = maximizing probability`}
      </CodeBlock>

      <InfoBox title="Congratulations!" type="success">
        You&apos;ve built a complete transformer from scratch. Next, we move to 
        diffusion theory and learn how to adapt this for parallel text generation!
      </InfoBox>
    </>
  ),

  // Module 2: Discrete Diffusion Theory
  '2-1-why-diffusion-for-text': (
    <>
      <h2>Why Diffusion for Text?</h2>
      <p>
        Autoregressive (AR) models like GPT generate text token-by-token, left-to-right. 
        This is sequential and slow. <strong>Diffusion models</strong> can generate all tokens in parallel!
      </p>

      <h3>The Generation Speed Problem</h3>
      <CodeBlock language="python">
{`# Autoregressive generation is sequential:
# "The" -> "cat" -> "sat" -> "on" -> "the" -> "mat"

# For a 1000-token response:
# - AR: 1000 sequential steps
# - Diffusion: ~10-50 parallel steps

# At 50ms per token (fast GPU):
# AR: 50 seconds
# Diffusion: 0.5-2.5 seconds (10-100x faster!)`}
      </CodeBlock>

      <h3>Comparison: AR vs Diffusion</h3>
      <table className="w-full my-6 text-sm">
        <thead>
          <tr className="border-b border-zinc-700">
            <th className="text-left py-2">Aspect</th>
            <th className="text-left py-2">Autoregressive (GPT)</th>
            <th className="text-left py-2">Diffusion (Mercury)</th>
          </tr>
        </thead>
        <tbody className="text-zinc-300">
          <tr className="border-b border-zinc-800"><td className="py-2">Generation</td><td>Sequential</td><td>Parallel</td></tr>
          <tr className="border-b border-zinc-800"><td className="py-2">Speed</td><td>1x</td><td>10-100x faster</td></tr>
          <tr className="border-b border-zinc-800"><td className="py-2">Quality</td><td>Excellent</td><td>Comparable</td></tr>
          <tr className="border-b border-zinc-800"><td className="py-2">Training</td><td>Predict next token</td><td>Denoise masked tokens</td></tr>
        </tbody>
      </table>

      <h3>The Key Insight</h3>
      <p>
        In image diffusion, we add Gaussian noise and learn to denoise. 
        For text, we can do something similar with <strong>token masking</strong>!
      </p>

      <InfoBox title="What Mercury Does" type="success">
        Mercury uses masked diffusion: instead of noise, tokens are randomly masked 
        (replaced with [MASK]). The model learns to predict the original token 
        given corrupted context.
      </InfoBox>

      <h3>Why Now?</h3>
      <ul>
        <li><strong>Research advances</strong>: MDLM (Masked Diffusion Language Models) from Google/DeepMind</li>
        <li><strong>Hardware</strong>: Parallel computation is cheap; sequential is expensive</li>
        <li><strong>Inception Labs</strong>: Proved it works at scale with Mercury</li>
      </ul>
    </>
  ),

  '2-2-discrete-vs-continuous': (
    <>
      <h2>Discrete vs Continuous Noise</h2>
      <p>
        Images are continuous (pixel values 0-255). Text is discrete (vocabulary indices).
        This changes everything about how we do diffusion!
      </p>

      <h3>Image Diffusion (Continuous)</h3>
      <CodeBlock language="python">
{`# In image diffusion:
# Pixel values are continuous floats
# We add Gaussian noise: x_t = sqrt(1-α_t) * x_0 + sqrt(α_t) * ε

# The model predicts noise or denoised image
# Output: continuous RGB values

# This works great for images!
# But text tokens are discrete (0, 1, 2, ..., vocab_size-1)`}
      </CodeBlock>

      <h3>Text is Discrete</h3>
      <p>Text tokens are categorical—adding Gaussian noise doesn&apos;t make sense:</p>
      <CodeBlock language="python">
{`# What does "cat" (token 1234) + noise = ?
# 1234.0 + 0.5 = 1234.5? That's not a valid token!

# Instead, for text we use discrete noise:
# - Masking: Replace token with [MASK]
# - Corruption: Replace token with random token  
# - State space approaches

# Masked Diffusion LM (MDLM) is the most effective:
# - Forward process: Randomly mask tokens
# - Reverse process: Model predicts original token`}
      </CodeBlock>

      <h3>Forward Process: Masking</h3>
      <CodeBlock language="python">
{`import torch

def create_masking_schedule(seq_len, num_steps):
    """
    Create a masking schedule for diffusion.
    At each step, we mask additional tokens.
    """
    masks = []
    mask_ratios = torch.linspace(0, 0.9, num_steps)  # 0% to 90% masked
    
    for t in range(num_steps):
        mask_ratio = mask_ratios[t]
        num_masked = int(seq_len * mask_ratio)
        
        # Randomly select positions to mask
        mask = torch.zeros(seq_len)
        mask_indices = torch.randperm(seq_len)[:num_masked]
        mask[mask_indices] = 1
        
        masks.append(mask.bool())
    
    return masks

# Example: 10 tokens, 5 diffusion steps
seq_len = 10
masks = create_masking_schedule(seq_len, num_steps=5)

for t, mask in enumerate(masks):
    visible = (~mask).sum().item()
    print(f"Step {t}: {visible}/{seq_len} tokens visible, {mask.sum()}/{seq_len} masked")`}
      </CodeBlock>

      <h3>Why Not Just Replace with Random Tokens?</h3>
      <p>
        Masking is better because:
      </p>
      <ul>
        <li>The model always sees a valid token (the mask)</li>
        <li>It&apos;s easier for the model to distinguish masked vs. unmasked</li>
        <li>The target is always the same type (original token)</li>
      </ul>

      <InfoBox title="Key Difference" type="info">
        Continuous diffusion: predict noise. Discrete diffusion: predict original token.
        The loss is the same (cross-entropy), but the formulation differs!
      </InfoBox>
    </>
  ),

  '2-3-forward-process': (
    <>
      <h2>The Forward Noising Process</h2>
      <p>
        The forward process gradually corrupts the data by masking tokens.
        At timestep t, a fraction of tokens are masked. The model sees this and 
        learns to predict the original.
      </p>

      <h3>Understanding the Forward Process</h3>
      <CodeBlock language="python">
{`import torch
import torch.nn.functional as F

class DiscreteDiffusion:
    def __init__(self, vocab_size, num_steps=100, mask_token_id=0):
        self.vocab_size = vocab_size
        self.num_steps = num_steps
        self.mask_token_id = mask_token_id
        
        # Linear schedule for masking probability
        # p_mask goes from 0 to max_mask_prob over num_steps
        self.schedule = torch.linspace(0, 0.9, num_steps)
    
    def forward_process(self, x_0, t):
        """
        Apply forward process at timestep t.
        
        Args:
            x_0: Original tokens (batch, seq_len)
            t: Timestep (scalar or tensor)
        Returns:
            x_t: Corrupted tokens with masks
            mask: Boolean mask indicating which tokens were masked
        """
        batch_size, seq_len = x_0.shape
        
        # Get masking probability for this timestep
        p_mask = self.schedule[t] if isinstance(t, int) else self.schedule[t]
        
        # Sample which tokens to mask
        mask = torch.rand(batch_size, seq_len, device=x_0.device) < p_mask
        
        # Create corrupted version
        x_t = x_0.clone()
        x_t[mask] = self.mask_token_id
        
        return x_t, mask

# Example usage
vocab_size = 30000
seq_len = 20
batch_size = 4

diffusion = DiscreteDiffusion(vocab_size, num_steps=100)

# Original tokens
x_0 = torch.randint(1, vocab_size, (batch_size, seq_len))  # Avoid 0 (mask)
print(f"Original: {x_0[0][:10].tolist()}")

# Apply forward process at different timesteps
for t in [0, 25, 50, 75, 99]:
    x_t, mask = diffusion.forward_process(x_0, t)
    masked_count = mask[0].sum().item()
    print(f"t={t}: {masked_count} tokens masked")
    print(f"  Corrupted: {x_t[0][:10].tolist()}")`}
      </CodeBlock>

      <h3>The Masking Schedule</h3>
      <p>We typically use a linear schedule where the masking probability increases with timestep:</p>
      <CodeBlock language="python">
{`import matplotlib.pyplot as plt

num_steps = 100
schedule = torch.linspace(0, 0.9, num_steps)

# At t=0: 0% tokens masked
# At t=50: 45% tokens masked  
# At t=99: 90% tokens masked

# This means early steps have few masks (easy denoising)
# Later steps have many masks (hard denoising)
# The model learns denoising at all levels!`}
      </CodeBlock>

      <h3>Training Signal</h3>
      <p>
        For each (x_0, t, x_t, mask) tuple:
      </p>
      <ul>
        <li>Input: x_t (corrupted sequence)</li>
        <li>Target: x_0 (original sequence)</li>
        <li>Loss: Only compute loss on masked positions!</li>
      </ul>

      <CodeBlock language="python">
{`def compute_loss(model, x_0, diffusion, t):
    """
    Compute loss for masked diffusion training.
    """
    # Apply forward process
    x_t, mask = diffusion.forward_process(x_0, t)
    
    # Get model predictions
    logits = model(x_t)  # (batch, seq_len, vocab_size)
    
    # Only compute loss on masked positions
    # Target is original token
    loss = F.cross_entropy(
        logits[mask],      # Predictions for masked positions
        x_0[mask]          # Original tokens
    )
    
    return loss

# Note: We never need to iterate through timesteps!
# The forward process is analytical (no simulation needed)`}
      </CodeBlock>

      <InfoBox title="Efficiency!" type="success">
        Unlike continuous diffusion, we can directly compute x_t at any timestep t.
        No Monte Carlo simulation needed. This makes training very efficient.
      </InfoBox>
    </>
  ),

  '2-4-reverse-process': (
    <>
      <h2>The Reverse Denoising Process</h2>
      <p>
        The reverse process (inference) starts from fully masked tokens and 
        iteratively reveals them. The model predicts which tokens should be at each position.
      </p>

      <h3>Generative Process</h3>
      <CodeBlock language="python">
{`def generate_with_diffusion(model, diffusion, seq_len, num_steps=10):
    """
    Generate text using masked diffusion.
    
    1. Start with all tokens masked
    2. Iteratively reveal tokens based on model predictions
    3. At each step, mask fewer tokens
    """
    model.eval()
    
    # Start: all tokens masked
    x_t = torch.full((1, seq_len), diffusion.mask_token_id, dtype=torch.long)
    
    # Timesteps from high to low (many masks -> few masks)
    steps = torch.linspace(diffusion.num_steps - 1, 0, num_steps).long()
    
    with torch.no_grad():
        for i, t in enumerate(steps):
            # How many tokens to predict this step?
            # Earlier steps: predict more
            # Later steps: predict fewer
            tokens_to_predict = seq_len // (num_steps - i)
            
            # Get model predictions
            logits = model(x_t)  # (1, seq_len, vocab_size)
            probs = F.softmax(logits, dim=-1)
            
            # Sample from predictions
            predictions = torch.multinomial(probs.view(-1, probs.size(-1)), 1).squeeze()
            
            # Mask positions we're not predicting yet
            # (simulate having seen the ground truth at those positions)
            mask_positions = torch.randperm(seq_len)[:tokens_to_predict]
            
            # Update x_t with predictions at mask positions
            x_t[0, mask_positions] = predictions[mask_positions]
    
    return x_t

# Note: This is a simplified version!
# Real implementations use different strategies`}
      </CodeBlock>

      <h3>Different Sampling Strategies</h3>
      <ul>
        <li><strong>Multistep</strong>: Predict a fraction of tokens per step</li>
        <li><strong>Ancestral sampling</strong>: Sample all at once after full denoising</li>
        <li><strong>Iterative refinement</strong>: Keep resampling low-confidence positions</li>
      </ul>

      <h3>The Sampling Trade-off</h3>
      <CodeBlock language="python">
{`# More steps = better quality but slower
# Fewer steps = faster but lower quality

# trade-off:
# 10 steps:  ~10x faster than AR, good quality
# 50 steps:  ~20x faster than AR, excellent quality
# 100 steps: ~10x faster than AR, best quality

# Mercury uses adaptive step count based on sequence length
# Short sequences: fewer steps
# Long sequences: more steps

# Key insight: diffusion is still parallel even with multiple steps!
# All token positions are processed simultaneously at each step`}
      </CodeBlock>

      <InfoBox title="Module 4 Preview" type="info">
        We&apos;ll cover advanced sampling strategies in detail: temperature scaling,
        top-k filtering, top-p (nucleus) sampling, and classifier-free guidance.
      </InfoBox>
    </>
  ),

  // Module 3: Masked Diffusion LM
  '3-1-mdm-intuition': (
    <>
      <h2>MDM Intuition</h2>
      <p>
        Masked Diffusion Language Models (MDLM) combine the power of BERT-style masked 
        language modeling with the generative capability of diffusion models.
      </p>

      <h3>The Core Idea</h3>
      <p>
        Instead of predicting <strong>next</strong> token given previous (AR), or predicting 
        <strong>current</strong> token given all others (BERT), MDLM predicts 
        <strong>original</strong> tokens from corrupted (masked) sequences.
      </p>

      <CodeBlock language="python">
{`# Comparison of approaches:

# Autoregressive (GPT):
# P(x_1, x_2, ..., x_n) = P(x_1) * P(x_2|x_1) * ... * P(x_n|x_1,...,x_{n-1})
# Sequential generation: 1 -> 2 -> 3 -> ... -> n

# Masked Language Model (BERT):
# P(x_masked | x_context) for each masked position
# Bidirectional understanding, but not generative

# Masked Diffusion (MDLM):
# x_t ~ q(x_t | x_0)  # Corrupt by masking
# p_θ(x_0 | x_t)      # Learn to denoise (generative!)`}
      </CodeBlock>

      <h3>Why It&apos;s Generative</h3>
      <p>
        Unlike BERT which is only trained on masked inputs, MDLM trains on all timesteps 
        (varying mask ratios). This allows it to generate from fully corrupted inputs!
      </p>

      <CodeBlock language="python">
{`# Training: model sees varying corruption levels
# t=0:   "The [MASK] sat on [MASK] mat"     -> predict "cat", "the"
# t=50:  "[MASK] [MASK] [MASK] on [MASK]"    -> predict "The", "cat", "sat", "the"
# t=99:  "[MASK] [MASK] [MASK] [MASK] [MASK]" -> predict everything

# At inference, we start at t=99 (fully masked)
# and denoise to t=0 (fully unmasked)`}
      </CodeBlock>

      <InfoBox title="Key Insight" type="success">
        The model learns denoising at all corruption levels, making it a true 
        generative model that can start from pure noise (masks) and produce samples.
      </InfoBox>
    </>
  ),

  '3-2-rao-blackwellized-loss': (
    <>
      <h2>Rao-Blackwellized Loss</h2>
      <p>
        A statistical technique that improves training efficiency by computing 
        expectations analytically instead of sampling.
      </p>

      <h3>The Problem</h3>
      <CodeBlock language="python">
{`# Naive approach: sample which positions to mask, then compute loss
# But this has high variance - different batches have different masks

# Better: use the expectation over all possible masking patterns
# This is what Rao-Blackwellization does!

# Instead of sampling mask m from q(m|x_0, t):
# E_{m ~ q}[loss(x_0, predict(x_t))]

# We compute: sum over all masks * probability * loss
# This has lower variance because we average over uncertainty`}
      </CodeBlock>

      <h3>The Rao-Blackwellized Objective</h3>
      <CodeBlock language="python">
{`def rao_blackwellized_loss(model, x_0, t, p_mask=0.5):
    """
    Compute Rao-Blackwellized loss for MDLM.
    
    The key insight: for each position, the expected loss is:
    E[loss] = p_mask * loss(mask) + (1 - p_mask) * loss(keep)
    
    Since "keep" positions have zero loss (we know the answer),
    we only need to compute loss for "mask" positions.
    
    But unlike sampling, we compute expected value over mask patterns!
    """
    batch_size, seq_len = x_0.shape
    
    # Probability of masking each position
    # Using marginal probability (not joint)
    mask_prob = p_mask * (1 - (1 - 1/seq_len) ** t)  # Approximation
    
    # Model predictions
    logits = model(x_0)  # (batch, seq_len, vocab)
    
    # Compute loss for each position
    log_probs = F.log_softmax(logits, dim=-1)
    target_log_probs = log_probs.gather(-1, x_0.unsqueeze(-1)).squeeze(-1)
    
    # Expected loss per position (Rao-Blackwellized)
    # Only masked positions contribute to loss gradient
    expected_loss = -mask_prob * target_log_probs
    
    return expected_loss.mean()`}
      </CodeBlock>

      <h3>Why It Works</h3>
      <ul>
        <li><strong>Lower variance</strong>: Averaging over possibilities reduces noise</li>
        <li><strong>Analytical</strong>: No extra sampling needed</li>
        <li><strong>Efficient</strong>: Same computation as naive approach</li>
      </ul>

      <InfoBox title="Paper Reference" type="info">
        See &ldquo;Simple and Effective Masked Diffusion Language Models&rdquo; 
        (NeurIPS 2024) for the full derivation and experimental results.
      </InfoBox>
    </>
  ),

  '3-3-implementation': (
    <>
      <h2>Implementing MDLM</h2>
      <p>Let&apos;s build a complete masked diffusion language model in PyTorch:</p>

      <CodeBlock language="python">
{`import torch
import torch.nn as nn
import torch.nn.functional as F
import math

class MaskedDiffusionLM(nn.Module):
    """
    A complete masked diffusion language model.
    
    Key differences from standard transformer:
    1. Takes corrupted (masked) input
    2. Outputs probability distribution over vocabulary for each position
    3. Trained with diffusion-style objectives
    """
    
    def __init__(
        self,
        vocab_size,
        d_model=512,
        num_heads=8,
        num_layers=6,
        d_ff=2048,
        max_len=1024,
        mask_token_id=0,
        num_diffusion_steps=100,
    ):
        super().__init__()
        
        self.vocab_size = vocab_size
        self.mask_token_id = mask_token_id
        self.num_diffusion_steps = num_diffusion_steps
        
        # Embeddings
        self.token_embedding = nn.Embedding(vocab_size, d_model)
        self.pos_embedding = nn.Embedding(max_len, d_model)
        
        # Transformer backbone
        self.blocks = nn.ModuleList([
            TransformerBlock(d_model, num_heads, d_ff)
            for _ in range(num_layers)
        ])
        
        # Output projection
        self.ln_f = nn.LayerNorm(d_model)
        self.lm_head = nn.Linear(d_model, vocab_size, bias=False)
        
        # Tie weights between embedding and output
        self.lm_head.weight = self.token_embedding.weight
        
        # Masking schedule
        self.register_buffer(
            'mask_rates',
            torch.linspace(0, 0.9, num_diffusion_steps)
        )
    
    def get_mask_rate(self, t):
        """Get masking probability for timestep t."""
        return self.mask_rates[t]
    
    def forward(self, x_t, t=None):
        """
        Forward pass.
        
        Args:
            x_t: Corrupted tokens (batch, seq_len)
            t: Optional timestep (for conditioning)
        Returns:
            logits: (batch, seq_len, vocab_size)
        """
        batch_size, seq_len = x_t.shape
        
        # Token embeddings
        h = self.token_embedding(x_t)
        
        # Add position embeddings
        positions = torch.arange(seq_len, device=x_t.device).unsqueeze(0)
        h = h + self.pos_embedding(positions)
        
        # Optional: timestep embedding for conditioning
        if t is not None:
            t_emb = self.get_timestep_embedding(t, h.size(-1))
            h = h + t_emb.unsqueeze(1)
        
        # Transformer blocks
        for block in self.blocks:
            h = block(h)
        
        # Output
        h = self.ln_f(h)
        logits = self.lm_head(h)
        
        return logits

    def get_timestep_embedding(self, timesteps, dim):
        """Sinusoidal timestep embeddings."""
        half_dim = dim // 2
        emb = math.log(10000) / (half_dim - 1)
        emb = torch.exp(torch.arange(half_dim, device=timesteps.device) * -emb)
        emb = timesteps.float()[:, None] * emb[None, :]
        emb = torch.cat([torch.sin(emb), torch.cos(emb)], dim=-1)
        if dim % 2 == 1:
            emb = F.pad(emb, (0, 1))
        return emb

# Create model
model = MaskedDiffusionLM(
    vocab_size=30000,
    d_model=256,
    num_heads=8,
    num_layers=6,
)

print(f"Model parameters: {sum(p.numel() for p in model.parameters()):,}")`}
      </CodeBlock>

      <InfoBox title="Architecture Note" type="info">
        This is similar to a standard transformer but designed for diffusion training.
        Mercury uses additional optimizations we&apos;ll cover in Module 7.
      </InfoBox>
    </>
  ),

  '3-4-training-loop': (
    <>
      <h2>Training the Model</h2>
      <p>Let&apos;s implement the full training pipeline:</p>

      <CodeBlock language="python">
{`from torch.utils.data import DataLoader
from datasets import load_dataset

class DiffusionTrainer:
    def __init__(self, model, lr=1e-4, warmup_steps=1000):
        self.model = model
        self.optimizer = torch.optim.AdamW(model.parameters(), lr=lr)
        self.scheduler = torch.optim.lr_scheduler.OneCycleLR(
            self.optimizer,
            max_lr=lr,
            total_steps=100000,
            pct_start=0.1,
        )
        self.step = 0
    
    def training_step(self, batch):
        """
        Single training step with Rao-Blackwellized loss.
        """
        self.model.train()
        input_ids = batch['input_ids']
        batch_size, seq_len = input_ids.shape
        
        # Sample random timesteps
        t = torch.randint(
            0, 
            self.model.num_diffusion_steps, 
            (batch_size,), 
            device=input_ids.device
        )
        
        # Get mask rates for each sample in batch
        mask_rates = self.model.mask_rates[t]
        
        # Create masks (which positions to predict)
        masks = torch.rand(batch_size, seq_len, device=input_ids.device) < mask_rates.unsqueeze(1)
        
        # Apply masks to input
        x_t = input_ids.clone()
        x_t[masks] = self.model.mask_token_id
        
        # Forward pass
        logits = self.model(x_t, t)
        
        # Compute loss only on masked positions
        loss = F.cross_entropy(
            logits[masks],
            input_ids[masks],
        )
        
        # Backward
        loss.backward()
        torch.nn.utils.clip_grad_norm_(self.model.parameters(), 1.0)
        self.optimizer.step()
        self.optimizer.zero_grad()
        
        self.step += 1
        return loss.item()

# Training loop
trainer = DiffusionTrainer(model, lr=1e-4)

# For demo, use a small batch
batch = {
    'input_ids': torch.randint(1, 30000, (4, 128))
}

for i in range(100):
    loss = trainer.training_step(batch)
    if i % 10 == 0:
        print(f"Step {i}: loss={loss:.4f}")`}
      </CodeBlock>

      <h3>Key Training Details</h3>
      <ul>
        <li><strong>Rao-Blackwellized loss</strong>: Only compute loss on masked positions</li>
        <li><strong>Random timesteps</strong>: Sample t uniformly for each batch</li>
        <li><strong>Gradient clipping</strong>: Prevent exploding gradients</li>
        <li><strong>Learning rate schedule</strong>: Warmup then decay</li>
      </ul>
    </>
  ),

  '3-5-mini-project': (
    <>
      <h2>Mini Project: Tiny MDLM</h2>
      <p>
        Let&apos;s train a small masked diffusion model on Shakespeare text!
        This will give you hands-on experience with the full pipeline.
      </p>

      <h3>Setup</h3>
      <CodeBlock language="python">
{`# First, get Shakespeare data
!pip install datasets torch

from datasets import load_dataset

# Load tiny shakespeare dataset
dataset = load_dataset("tiny_shakespeare")
print(dataset)
# DatasetDict({
#     train: Dataset({
#         features: ['text'],
#         num_rows: 1
#     })
# })

text = dataset['train'][0]['text']
print(f"Text length: {len(text):,} characters")

# Tokenize (simple character-level for demo)
# For real models, use BPE tokenizers like GPT
char_vocab = sorted(list(set(text)))
vocab_size = len(char_vocab)
char_to_idx = {c: i for i, c in enumerate(char_vocab)}
idx_to_char = {i: c for c, i in char_to_idx.items()}

def encode(text):
    return [char_to_idx[c] for c in text]

def decode(ids):
    return ''.join([idx_to_char[i] for i in ids])

# Create training sequences
seq_len = 256
encoded = torch.tensor(encode(text))
num_sequences = len(encoded) // seq_len
sequences = encoded[:num_sequences * seq_len].view(-1, seq_len)
print(f"Training sequences: {len(sequences):,}")`}
      </CodeBlock>

      <h3>Train the Model</h3>
      <CodeBlock language="python">
{`import torch
from torch.utils.data import DataLoader, TensorDataset

# Create dataloader
train_loader = DataLoader(
    TensorDataset(sequences),
    batch_size=32,
    shuffle=True
)

# Model (tiny for quick training)
model = MaskedDiffusionLM(
    vocab_size=vocab_size,
    d_model=256,
    num_heads=4,
    num_layers=4,
    d_ff=1024,
    max_len=seq_len,
)

trainer = DiffusionTrainer(model, lr=3e-4)

# Train!
for epoch in range(3):
    total_loss = 0
    for batch in train_loader:
        loss = trainer.training_step({'input_ids': batch[0]})
        total_loss += loss
    
    avg_loss = total_loss / len(train_loader)
    print(f"Epoch {epoch+1}: avg loss = {avg_loss:.4f}")`}
      </CodeBlock>

      <h3>Generate Text</h3>
      <CodeBlock language="python">
{`def generate(model, prompt, num_tokens=100, num_steps=20):
    model.eval()
    
    # Encode prompt
    input_ids = torch.tensor(encode(prompt)).unsqueeze(0)
    seq_len = 256
    
    # Pad if needed
    if input_ids.size(1) < seq_len:
        padding = torch.zeros(1, seq_len - input_ids.size(1), dtype=torch.long)
        input_ids = torch.cat([input_ids, padding], dim=1)
    
    # Start with masks
    x_t = torch.full((1, seq_len), model.mask_token_id, dtype=torch.long)
    
    # Fill with prompt (treat as already "denoised")
    x_t[0, :input_ids.size(1)] = input_ids[0, :input_ids.size(1)]
    
    # Iteratively denoise
    steps = torch.linspace(model.num_diffusion_steps - 1, 0, num_steps).long()
    
    with torch.no_grad():
        for t in steps:
            logits = model(x_t)
            probs = F.softmax(logits, dim=-1)
            
            # Sample new tokens
            new_tokens = torch.multinomial(probs.view(-1, probs.size(-1)), 1).squeeze()
            
            # Unmask positions we&apos;re processing this step
            # (simplified: unmask last few positions)
            unmask_count = seq_len // num_steps
            positions = torch.arange(seq_len - 1, seq_len - unmask_count - 1, -1)
            
            for pos in positions:
                if x_t[0, pos] == model.mask_token_id:
                    x_t[0, pos] = new_tokens[pos]
    
    return decode(x_t[0].tolist())

# Generate!
prompt = "ROMEO:"
generated = generate(model, prompt, num_tokens=200)
print(generated[:500])`}
      </CodeBlock>

      <InfoBox title="Challenge" type="success">
        Try training longer, increasing model size, or switching to BPE tokens.
        Can you get coherent Shakespeare dialogue?
      </InfoBox>
    </>
  ),

  // Module 4: Sampling Strategies
  '4-1-multistep-sampling': (
    <>
      <h2>Multistep Sampling</h2>
      <p>
        Unlike images where you denoise gradually, text diffusion often uses fewer steps
        with more tokens revealed per step. Let&apos;s explore different strategies.
      </p>

      <h3>Uniform vs Non-Uniform Steps</h3>
      <CodeBlock language="python">
{`import torch
import torch.nn.functional as F

def get_denoising_schedule(num_steps, strategy='uniform'):
    """
    Different strategies for choosing which tokens to denoise at each step.
    """
    if strategy == 'uniform':
        # Equal tokens per step
        tokens_per_step = [seq_len // num_steps] * num_steps
    
    elif strategy == 'linear':
        # More tokens early, fewer later
        # (easier problems first)
        tokens_per_step = [
            int(seq_len * (num_steps - i) / num_steps)
            for i in range(num_steps)
        ]
    
    elif strategy == 'quadratic':
        # Start very slow, speed up
        tokens_per_step = [
            int(seq_len * (i / num_steps) ** 2)
            for i in range(1, num_steps + 1)
        ]
    
    elif strategy == 'cosine':
        # Cosine annealing for tokens per step
        import math
        steps = torch.linspace(0, math.pi/2, num_steps)
        tokens_per_step = [int(seq_len * math.sin(s)) for s in steps]
    
    return tokens_per_step

# Mercury uses adaptive scheduling based on sequence length`}
      </CodeBlock>

      <h3>Implementation</h3>
      <CodeBlock language="python">
{`def multistep_sample(
    model,
    seq_len,
    num_steps=20,
    mask_token_id=0,
    schedule_strategy='linear',
    temperature=1.0,
):
    """
    Generate text using multistep denoising.
    """
    model.eval()
    
    # Start fully masked
    x = torch.full((1, seq_len), mask_token_id, dtype=torch.long)
    
    # Get step schedule
    tokens_per_step = get_denoising_schedule(num_steps, schedule_strategy)
    
    # Cumulative positions to reveal
    cumulative = [0]
    for count in tokens_per_step:
        cumulative.append(min(cumulative[-1] + count, seq_len))
    
    with torch.no_grad():
        for step in range(num_steps):
            t = num_steps - 1 - step  # Go backwards in time
            
            # Current positions to reveal
            start_pos = cumulative[step]
            end_pos = cumulative[step + 1]
            
            if start_pos >= seq_len:
                break
            
            # Get model predictions
            logits = model(x, torch.tensor([t]))
            
            # Apply temperature
            if temperature != 1.0:
                logits = logits / temperature
            
            probs = F.softmax(logits, dim=-1)
            
            # Sample for positions in this batch
            for pos in range(start_pos, min(end_pos, seq_len)):
                probs_pos = probs[0, pos]
                x[0, pos] = torch.multinomial(probs_pos, 1).item()
    
    return x

# Example: 20 steps, linear schedule, temperature 0.8
# result = multistep_sample(model, seq_len=128, num_steps=20, temperature=0.8)`}
      </CodeBlock>

      <InfoBox title="Quality vs Speed" type="info">
        More steps = better quality but slower. Mercury typically uses 10-20 steps
        and achieves quality comparable to 100+ step continuous diffusion.
      </InfoBox>
    </>
  ),

  '4-2-greedysampling': (
    <>
      <h2>Greedy vs Random Sampling</h2>
      <p>
        When generating tokens, we can either take the highest-probability token
        (greedy) or sample from the distribution (random). Both have trade-offs.
      </p>

      <h3>Greedy Sampling</h3>
      <CodeBlock language="python">
{`def greedy_sample(logits):
    """
    Always take the token with highest probability.
    
    Pros:
    - Deterministic
    - Often gets the most likely completion
    
    Cons:
    - Repetitive
    - No creativity/diversity
    """
    return torch.argmax(logits, dim=-1)

# Example
logits = torch.tensor([[-2.0, 0.5, -1.0, 3.0]])  # Token 3 has highest prob
print(f"Greedy choice: {greedy_sample(logits)}")  # tensor([3])`}
      </CodeBlock>

      <h3>Random Sampling</h3>
      <CodeBlock language="python">
{`def random_sample(logits, temperature=1.0):
    """
    Sample from the probability distribution.
    
    Args:
        logits: Raw model outputs
        temperature: Higher = more random, Lower = more deterministic
    
    Temperature effects:
    - T=1.0: Use raw probabilities
    - T<1.0: Sharpen distribution (more greedy)
    - T>1.0: Flatten distribution (more random)
    """
    if temperature != 1.0:
        logits = logits / temperature
    
    probs = F.softmax(logits, dim=-1)
    return torch.multinomial(probs, 1).squeeze(-1)

# Example
logits = torch.tensor([[-2.0, 0.5, -1.0, 3.0]])
print(f"T=1.0: {random_sample(logits, 1.0)}")
print(f"T=0.5: {random_sample(logits, 0.5)}")  # More likely to pick token 3
print(f"T=2.0: {random_sample(logits, 2.0)}")  # More random`}
      </CodeBlock>

      <h3>When to Use What</h3>
      <table className="w-full my-6 text-sm">
        <thead>
          <tr className="border-b border-zinc-700">
            <th className="text-left py-2">Use Case</th>
            <th className="text-left py-2">Best Strategy</th>
          </tr>
        </thead>
        <tbody className="text-zinc-300">
          <tr className="border-b border-zinc-800">
            <td className="py-2">Math / Code</td>
            <td>Greedy or low temperature</td>
          </tr>
          <tr className="border-b border-zinc-800">
            <td className="py-2">Creative writing</td>
            <td>Random with temperature ~0.7-1.0</td>
          </tr>
          <tr className="border-b border-zinc-800">
            <td className="py-2">Balanced</td>
            <td>Temperature ~0.8-1.0</td>
          </tr>
        </tbody>
      </table>

      <InfoBox title="Tip" type="success">
        For most text generation tasks, a temperature of 0.7-0.9 provides
        a good balance between quality and diversity.
      </InfoBox>
    </>
  ),

  '4-3-temperatur-topk-topp': (
    <>
      <h2>Temperature, Top-K, and Top-P</h2>
      <p>
        Advanced sampling techniques that give you fine-grained control over
        the randomness and quality of generated text.
      </p>

      <h3>Top-K Sampling</h3>
      <p>Only sample from the top K most likely tokens:</p>
      <CodeBlock language="python">
{`def top_k_sample(logits, k=10, temperature=1.0):
    """
    Sample from top-k tokens only.
    
    This prevents sampling from very unlikely tokens while
    maintaining some randomness.
    """
    if temperature != 1.0:
        logits = logits / temperature
    
    # Zero out all but top-k
    top_k_values, top_k_indices = torch.topk(logits, k, dim=-1)
    
    # Create mask for non-top-k
    mask = torch.ones_like(logits).scatter_(-1, top_k_indices, 0.0)
    logits_masked = logits.masked_fill(mask.bool(), float('-inf'))
    
    probs = F.softmax(logits_masked, dim=-1)
    return torch.multinomial(probs, 1).squeeze(-1)

# k=1 is equivalent to greedy
# k=vocab_size is equivalent to regular sampling`}
      </CodeBlock>

      <h3>Top-P (Nucleus) Sampling</h3>
      <p>Sample from the smallest set of tokens whose cumulative probability exceeds p:</p>
      <CodeBlock language="python">
{`def top_p_sample(logits, p=0.9, temperature=1.0):
    """
    Nucleus sampling: dynamically choose k based on probability mass.
    
    This adapts to the shape of the distribution:
    - Sharp distribution: fewer tokens needed to reach p
    - Flat distribution: more tokens needed
    """
    if temperature != 1.0:
        logits = logits / temperature
    
    probs = F.softmax(logits, dim=-1)
    sorted_probs, sorted_indices = torch.sort(probs, descending=True)
    
    # Cumulative probability
    cumsum_probs = torch.cumsum(sorted_probs, dim=-1)
    
    # Find cutoff where cumsum exceeds p
    # Add 1 to include the token that crosses the threshold
    n_to_keep = (cumsum_probs <= p).sum() + 1
    
    # Create mask
    mask = torch.ones_like(logits)
    mask[sorted_indices[n_to_keep:]] = 0
    
    logits_masked = logits.masked_fill(mask.bool(), float('-inf'))
    probs_masked = F.softmax(logits_masked, dim=-1)
    
    return torch.multinomial(probs_masked, 1).squeeze(-1)

# p=1.0: all tokens (equivalent to regular sampling)
# p=0.9: typically keep ~5-20% of vocabulary
# p=0.5: very focused, less diverse`}
      </CodeBlock>

      <h3>Combining Techniques</h3>
      <CodeBlock language="python">
{`def advanced_sample(
    logits,
    temperature=0.8,
    top_k=50,
    top_p=0.95,
):
    """
    Industry-standard sampling: apply top-k, then top-p.
    """
    # Apply temperature
    logits = logits / temperature
    
    # Apply top-k first
    if top_k > 0:
        top_k_values, top_k_indices = torch.topk(logits, top_k, dim=-1)
        mask = torch.ones_like(logits).scatter_(-1, top_k_indices, 0.0)
        logits = logits.masked_fill(mask.bool(), float('-inf'))
    
    # Apply top-p on remaining
    if top_p < 1.0:
        probs = F.softmax(logits, dim=-1)
        sorted_probs, sorted_indices = torch.sort(probs, descending=True)
        cumsum = torch.cumsum(sorted_probs, dim=-1)
        
        # Remove tokens with cumsum > top_p
        cumsum_mask = cumsum > top_p
        # Keep at least 1 token
        cumsum_mask[..., 1:] = cumsum_mask[..., :-1].clone()
        cumsum_mask[..., 0] = False
        
        remove_indices = sorted_indices[cumsum_mask]
        logits[..., remove_indices] = float('-inf')
    
    # Final sampling
    probs = F.softmax(logits, dim=-1)
    return torch.multinomial(probs, 1).squeeze(-1)

# GPT-3 style: temperature=0.8, top_p=0.95
# Often produces high-quality, diverse text`}
      </CodeBlock>

      <InfoBox title="Experiment!" type="success">
        Try different combinations of temperature, top_k, and top_p.
        For code generation, try lower temperature (0.2-0.5) with higher top_p (0.9-0.95).
      </InfoBox>
    </>
  ),

  // Module 5: Scaling & Training
  '5-1-scaling-laws': (
    <>
      <h2>Scaling Laws for Diffusion LMs</h2>
      <p>
        How does performance scale with model size, data, and compute?
        Understanding scaling laws helps us allocate resources efficiently.
      </p>

      <h3>The Chinchilla Scaling Laws</h3>
      <p>
        Kaplan et al. (2020) found power-law scaling for autoregressive models.
        Hoffmann et al. (2022) refined this: for a given compute budget,
        model size and training tokens should scale equally.
      </p>

      <CodeBlock language="python">
{`import torch
import numpy as np
import matplotlib.pyplot as plt

# Chinchilla-optimal scaling (roughly):
# If doubling compute, also double model size AND training tokens

# Kaplan et al. original scaling:
# L(N) ~ N^-0.076  (loss decreases slowly with model size)

# Chinchilla update:
# Optimal tokens ≈ 20 * model_parameters
# For a 7B model: train on ~140B tokens
# For a 70B model: train on ~1.4T tokens

# For diffusion models, similar patterns hold:
# Larger models + more data = better quality
# But efficiency matters too!`}
      </CodeBlock>

      <h3>Compute-Optimal Frontier</h3>
      <CodeBlock language="python">
{`def compute_optimal_frontier(total_compute_flops, base_model_params=1e9):
    """
    Given compute budget, estimate optimal model size and data.
    
    Chinchilla rule of thumb:
    - tokens = 20 * parameters
    - parameters scales ~ compute^(0.5)
    - tokens scales ~ compute^(0.5)
    """
    # Scale factor (relative to base)
    scale = total_compute_flops / (20 * base_model_params)
    
    optimal_params = base_model_params * np.sqrt(scale)
    optimal_tokens = 20 * optimal_params
    
    return optimal_params, optimal_tokens

# Example compute budgets (in FLOPs)
compute_budgets = {
    'Small (GPT-2)': 1e20,
    'Medium': 1e22,
    'Large (GPT-3)': 1e23,
    'Very Large': 1e24,
}

for name, compute in compute_budgets.items():
    params, tokens = compute_optimal_frontier(compute)
    print(f"{name}: ~{params/1e9:.1f}B params, ~{tokens/1e9:.0f}B tokens")`}
      </CodeBlock>

      <h3>Diffusion-Specific Considerations</h3>
      <ul>
        <li><strong>More steps can help</strong>: More denoising steps can compensate for smaller models</li>
        <li><strong>Training stability</strong>: Larger models are often more stable to train</li>
        <li><strong>Memory efficiency</strong>: Techniques like gradient checkpointing enable larger models</li>
      </ul>

      <InfoBox title="Practical Advice" type="info">
        For research/experimentation: use the smallest model that achieves
        your quality target. Scale up only when needed.
      </InfoBox>
    </>
  ),

  '5-2-efficient-attention': (
    <>
      <h2>Efficient Attention Patterns</h2>
      <p>
        Standard attention is O(n²) in sequence length—problematic for long contexts.
        Let&apos;s explore efficient attention variants.
      </p>

      <h3>Flash Attention</h3>
      <p>
        Flash Attention computes attention exactly but with tiling and recomputation
        to achieve O(n) memory instead of O(n²).
      </p>
      <CodeBlock language="python">
{`# Standard attention: O(n^2) memory
# Flash Attention: O(n) memory, same output

# Install Flash Attention
!pip install flash-attn --no-build-isolation

import flash_attn

class FlashMultiHeadAttention(nn.Module):
    def __init__(self, d_model, num_heads):
        super().__init__()
        self.d_model = d_model
        self.num_heads = num_heads
        self.d_k = d_model // num_heads
        
        self.W_qkv = nn.Linear(d_model, 3 * d_model)
        self.W_o = nn.Linear(d_model, d_model)
    
    def forward(self, x, causal=True):
        batch_size, seq_len, _ = x.shape
        
        # Project to Q, K, V
        qkv = self.W_qkv(x)
        q, k, v = qkv.chunk(3, dim=-1)
        
        # Reshape for flash attention
        q = q.view(batch_size, seq_len, self.num_heads, self.d_k)
        k = k.view(batch_size, seq_len, self.num_heads, self.d_k)
        v = v.view(batch_size, seq_len, self.num_heads, self.d_k)
        
        # Flash attention call
        out = flash_attn.flash_attn_func(
            q, k, v,
            causal=causal,
        )
        
        out = out.reshape(batch_size, seq_len, self.d_model)
        return self.W_o(out)

# Benefits:
# - 2-4x faster attention computation
# - Dramatically reduced memory usage
# - No approximation!`}
      </CodeBlock>

      <h3>Sliding Window Attention</h3>
      <CodeBlock language="python">
{`class SlidingWindowAttention(nn.Module):
    """
    Only attend to nearby tokens (local context).
    O(n * window_size) instead of O(n^2)
    
    Good for:
    - Processing very long sequences
    - Capturing local patterns
    - Combining with global attention
    """
    def __init__(self, d_model, num_heads, window_size=512):
        super().__init__()
        self.window_size = window_size
        
        # Standard attention for window
        self.attention = MultiHeadAttention(d_model, num_heads)
    
    def forward(self, x):
        batch_size, seq_len, d_model = x.shape
        
        # Pad if necessary
        if seq_len > self.window_size:
            # Process in chunks
            outputs = []
            for i in range(0, seq_len, self.window_size // 2):
                chunk = x[:, i:i+self.window_size]
                out = self.attention(chunk)
                outputs.append(out)
            
            # Overlap and add
            x = torch.cat(outputs, dim=1)
        
        return x

# Often combined with global attention on key positions`}
      </CodeBlock>

      <h3>Sparse Attention Patterns</h3>
      <CodeBlock language="python">
{`# Other sparse patterns:
# 1. BigBird: global + random + window
# 2. Longformer: global + window + dilated
# 3. Reformer: locality-sensitive hashing
# 4. Performer: random feature approximation

# Longformer pattern example:
# - Global attention on [CLS] token
# - Window attention with sliding window
# - Dilated attention for long-range (every 2^k position)

# Trade-offs:
# - Sparse = faster but may miss some patterns
# - Approximate = faster but some accuracy loss
# - Flash = exact + efficient (usually preferred if available)`}
      </CodeBlock>

      <InfoBox title="Recommendation" type="success">
        Use Flash Attention when possible—it&apos;s exact, fast, and memory-efficient.
        For very long contexts, combine with sliding window.
      </InfoBox>
    </>
  ),

  '5-3-mixed-precision': (
    <>
      <h2>Mixed Precision Training</h2>
      <p>
        Train large models efficiently using FP16/BF16 while maintaining accuracy.
        This reduces memory by ~50% and often speeds up training 2-3x.
      </p>

      <h3>Precision Formats</h3>
      <table className="w-full my-6 text-sm">
        <thead>
          <tr className="border-b border-zinc-700">
            <th className="text-left py-2">Format</th>
            <th className="text-left py-2">Memory</th>
            <th className="text-left py-2">Range</th>
            <th className="text-left py-2">Notes</th>
          </tr>
        </thead>
        <tbody className="text-zinc-300">
          <tr className="border-b border-zinc-800">
            <td className="py-2">FP32</td><td>32 bits</td><td>3.4e38</td><td>Full precision</td>
          </tr>
          <tr className="border-b border-zinc-800">
            <td className="py-2">FP16</td><td>16 bits</td><td>64k</td><td>May underflow</td>
          </tr>
          <tr className="border-b border-zinc-800">
            <td className="py-2">BF16</td><td>16 bits</td><td>3.4e38</td><td>Same range as FP32, better for training</td>
          </tr>
        </tbody>
      </table>

      <CodeBlock language="python">
{`import torch
from torch.cuda.amp import autocast, GradScaler

# Automatic Mixed Precision (AMP)
scaler = GradScaler()
model = model.cuda()

for batch in dataloader:
    optimizer.zero_grad()
    
    # Forward pass in FP16
    with autocast(dtype=torch.float16):
        output = model(input)
        loss = criterion(output, target)
    
    # Scale loss and backward
    scaler.scale(loss).backward()
    
    # Unscale gradients and clip
    scaler.unscale_(optimizer)
    torch.nn.utils.clip_grad_norm_(model.parameters(), 1.0)
    
    # Optimizer step
    scaler.step(optimizer)
    scaler.update()

# GradScaler handles:
# - Gradient scaling to prevent underflow
# - Loss scaling to maintain precision
# - Gradient unscaling for gradient clipping`}
      </CodeBlock>

      <h3>What to Keep in FP32</h3>
      <CodeBlock language="python">
{`# Typically keep in FP16/BF16:
# - Forward pass (fast)
# - Most gradients

# Keep in FP32:
# - Master weights (accumulate small updates better)
# - LayerNorm, Softmax (can be numerically unstable in FP16)
# - Loss computation sometimes

# Modern libraries handle this automatically!
# DeepSpeed, Megatron, etc.`}
      </CodeBlock>

      <InfoBox title="BF16 vs FP16" type="info">
        BF16 is preferred for training because it has the same range as FP32.
        FP16 is fine for inference. Most new GPUs (A100, H100) support BF16 natively.
      </InfoBox>
    </>
  ),

  '5-4-distributed-training': (
    <>
      <h2>Distributed Training</h2>
      <p>
        Training large models requires distributing across multiple GPUs.
        The two main strategies: data parallelism and model parallelism.
      </p>

      <h3>Data Parallelism</h3>
      <p>
        Replicate the model on each GPU, process different batches, and
        synchronize gradients. Simple and effective.
      </p>
      <CodeBlock language="python">
{`# Data Parallel in PyTorch
import torch.nn.parallel as parallel

# Wrap model with DataParallel
model = nn.DataParallel(model, device_ids=[0, 1, 2, 3])

# Forward pass is automatically distributed
output = model(input)

# Simple but:
# - All GPUs need to fit the full model
# - Communication overhead for gradients

# Better: DistributedDataParallel (DDP)
from torch.distributed import init_process_group

# Each GPU runs this:
model = model.cuda()
model = nn.parallel.DistributedDataParallel(model)

# DDP:
# - Gradients synchronized via all-reduce
# - More efficient than DataParallel
# - Preferred for multi-GPU training`}
      </CodeBlock>

      <h3>Model Parallelism</h3>
      <p>
        When a single model is too large for one GPU, split it across GPUs.
        Two types: tensor parallelism and pipeline parallelism.
      </p>
      <CodeBlock language="python">
{`# Tensor Parallelism: split layers across GPUs
# Used in Megatron-LM

# Example: Column-parallel linear layer
class ColumnParallelLinear(nn.Module):
    def __init__(self, input_size, output_size, world_size):
        super().__init__()
        self.output_size_per_gpu = output_size // world_size
        self.weight = nn.Parameter(torch.randn(
            self.output_size_per_gpu, input_size
        ))
    
    def forward(self, x):
        # All-gather along output dimension
        output = F.linear(x, self.weight)
        outputs = [torch.zeros_like(output) for _ in range(world_size)]
        dist.all_gather(outputs, output)
        return torch.stack(outputs, dim=0).sum(dim=0)

# Pipeline Parallelism: split layers across GPUs
# GPU0 -> GPU1 -> GPU2 -> GPU3

# Recommended for very large models (>80B parameters)`}
      </CodeBlock>

      <h3>ZeRO Optimizations</h3>
      <CodeBlock language="python">
{`# ZeRO (Zero Redundancy Optimizer) from DeepSpeed
# Stages:
# - ZeRO-1: Shard optimizer states across GPUs
# - ZeRO-2: + shard gradients
# - ZeRO-3: + shard model parameters

# With ZeRO-3, you can fit a 100B model on 8x 80GB GPUs!

# DeepSpeed config example:
# {
#     "zero_optimization": {
#         "stage": 3,
#         "offload_optimizer": {"device": "cpu"},
#         "offload_param": {"device": "cpu"}
#     }
# }

# Libraries: DeepSpeed, FSDP (Fairscale), Megatron`}
      </CodeBlock>

      <InfoBox title="Practical Setup" type="success">
        Start with DDP on a single node. Only add ZeRO/PP/TP when
        you hit memory limits. Use libraries like DeepSpeed or Lightning.
      </InfoBox>
    </>
  ),

  // Module 6: Conditioning & Guidance
  '6-1-conditiong-intro': (
    <>
      <h2>Conditioning Basics</h2>
      <p>
        How do we make diffusion models follow prompts and instructions?
        This is called conditioning—the model learns to generate based on input.
      </p>

      <h3>Types of Conditioning</h3>
      <ul>
        <li><strong>Prompt conditioning</strong>: Given &ldquo;Write a poem about cats&rdquo;, generate poem</li>
        <li><strong>Class conditioning</strong>: Generate images of &ldquo;dogs&rdquo; vs &ldquo;cats&rdquo;</li>
        <li><strong>Style conditioning</strong>: Generate in &ldquo;impressionist style&rdquo;</li>
        <li><strong>Task conditioning</strong>: &ldquo;Translate to French: Hello&rdquo; → &ldquo;Bonjour&rdquo;</li>
      </ul>

      <h3>Methods for Conditioning</h3>
      <CodeBlock language="python">
{`# Method 1: Concatenate conditioning to input
def condition_by_concat(model, text_tokens, cond_tokens):
    """
    Concatenate condition to input.
    """
    # text_tokens: [batch, seq_len] - positions to generate
    # cond_tokens: [batch, cond_len] - conditioning (prompt)
    
    # Embed both
    text_emb = model.embed(text_tokens)
    cond_emb = model.embed(cond_tokens)
    
    # Concatenate
    combined = torch.cat([cond_emb, text_emb], dim=1)
    
    return model.transformer(combined)

# Method 2: Cross-attention to conditioning
# Condition flows through cross-attention layers
# Text encoder attends to conditioning tokens

# Method 3: Adaptive layer norm (adaLN)
# Conditioning modulates layer normalization`}
      </CodeBlock>

      <h3>Cross-Attention Conditioning</h3>
      <CodeBlock language="python">
{`class CrossAttentionBlock(nn.Module):
    def __init__(self, d_model, num_heads, d_cond):
        super().__init__()
        # Condition encoder
        self.condition_proj = nn.Linear(d_cond, d_model)
        
        # Cross-attention: text attends to condition
        self.cross_attention = MultiHeadAttention(d_model, num_heads)
        self.norm = nn.LayerNorm(d_model)
    
    def forward(self, x, condition):
        """
        x: hidden states to attend
        condition: conditioning signal (e.g., text embeddings)
        """
        cond_emb = self.condition_proj(condition)
        
        # Cross-attention: x attends to condition
        attn_out = self.cross_attention(x, cond_emb)
        x = self.norm(x + attn_out)
        
        return x

# Text: "I love"
# Condition: "cats" (embeddings)
# The model learns: given "cats" conditioning, generate cat-related text`}
      </CodeBlock>

      <InfoBox title="Key Insight" type="info">
        The model learns to attend to conditioning signals at every layer,
        allowing deep integration of prompt information.
      </InfoBox>
    </>
  ),

  '6-2-cfg': (
    <>
      <h2>Classifier-Free Guidance</h2>
      <p>
        CFG is a simple but powerful technique that boosts conditioning without
        needing a separate classifier. It&apos;s the key technique behind Stable Diffusion and Mercury.
      </p>

      <h3>The Problem</h3>
      <p>
        Without guidance, models may ignore conditioning signals.
        With guidance, they follow prompts better but need a classifier.
      </p>

      <h3>CFG Solution</h3>
      <CodeBlock language="python">
{`def classifier_free_guidance(
    model,
    x_t,
    t,
    cond,
    cfg_scale=7.5,
    dropout_prob=0.1,
):
    """
    Classifier-Free Guidance for diffusion models.
    
    Args:
        model: The diffusion model
        x_t: Corrupted input
        t: Timestep
        cond: Conditioning (prompt)
        cfg_scale: Guidance strength (higher = more prompt adherence)
        dropout_prob: Probability of dropping conditioning during training
    
    The trick:
    1. Train model with AND without conditioning
    2. At inference, extrapolate between conditioned and unconditioned
    """
    # Predict with conditioning
    logits_cond = model(x_t, t, condition=cond)
    
    # Predict without conditioning (set to null/empty)
    logits_uncond = model(x_t, t, condition=null_token)
    
    # Apply guidance
    # guidance = cond + scale * (cond - uncond)
    guided_logits = logits_uncond + cfg_scale * (logits_cond - logits_uncond)
    
    return guided_logits

# Key insight:
# - Higher cfg_scale = stronger adherence to prompt
# - Too high = artifacts and reduced diversity
# - Optimal typically 5-10 for images, lower for text`}
      </CodeBlock>

      <h3>Training with CFG</h3>
      <CodeBlock language="python">
{`def cfg_training_step(model, batch, cfg_dropout=0.1):
    """
    Train model to work with and without conditioning.
    """
    input_ids = batch['input_ids']
    prompt = batch['prompt']
    
    # Randomly drop conditioning
    drop_mask = torch.rand(batch_size) < cfg_dropout
    condition = prompt.clone()
    condition[drop_mask] = null_token  # Dropped!
    
    # Same forward pass regardless of conditioning
    # Model learns to handle both cases
    loss = compute_loss(model, input_ids, condition)
    
    return loss

# At training time:
# - Some samples have conditioning (prompt)
# - Some samples have null conditioning
# Model learns both simultaneously

# At inference:
# - Use CFG to interpolate between them`}
      </CodeBlock>

      <InfoBox title="Why It Works" type="success">
        By training with dropped conditioning, the model learns a &ldquo;default&rdquo; generation
        that&apos;s then shifted toward the conditioning signal. No extra classifier needed!
      </InfoBox>
    </>
  ),

  '6-3-implementation': (
    <>
      <h2>CFG Implementation</h2>
      <p>Let&apos;s implement CFG for our masked diffusion model:</p>

      <CodeBlock language="python">
{`class ConditionalMaskedDiffusionLM(nn.Module):
    """
    MDLM with conditioning and CFG support.
    """
    def __init__(
        self,
        vocab_size,
        d_model=512,
        num_heads=8,
        num_layers=6,
        cond_dim=768,  # Embedding dimension for conditioning
    ):
        super().__init__()
        
        self.vocab_size = vocab_size
        self.mask_token_id = 0
        
        # Token embeddings
        self.token_embedding = nn.Embedding(vocab_size + 1, d_model)  # +1 for mask
        
        # Condition embeddings (e.g., from a text encoder)
        self.cond_proj = nn.Linear(cond_dim, d_model)
        
        # Transformer backbone
        self.blocks = nn.ModuleList([
            TransformerBlock(d_model, num_heads, d_ff)
            for _ in range(num_layers)
        ])
        
        # Output head
        self.ln_f = nn.LayerNorm(d_model)
        self.lm_head = nn.Linear(d_model, vocab_size, bias=False)
    
    def forward(self, x_t, t=None, condition=None, use_cfg=False, cfg_scale=1.0):
        """
        Forward with optional conditioning.
        """
        batch_size, seq_len = x_t.shape
        
        # Token embeddings
        h = self.token_embedding(x_t)
        
        # Add conditioning if provided
        if condition is not None:
            cond_emb = self.cond_proj(condition)
            h = h + cond_emb.unsqueeze(1)
        
        if use_cfg and condition is not None:
            # Compute unconditional prediction
            h_uncond = self.token_embedding(x_t)
            # (no conditioning added)
            
            # Process both through transformer
            for block in self.blocks:
                h_cond = block(h)
                h_uncond = block(h_uncond)
            
            # Apply guidance
            h = h_uncond + cfg_scale * (h_cond - h_uncond)
        else:
            for block in self.blocks:
                h = block(h)
        
        # Output
        h = self.ln_f(h)
        logits = self.lm_head(h)
        
        return logits`}
      </CodeBlock>

      <h3>Generation with CFG</h3>
      <CodeBlock language="python">
{`def generate_with_cfg(
    model,
    prompt_emb,
    seq_len,
    cfg_scale=7.5,
    num_steps=20,
    temperature=1.0,
):
    """
    Generate with classifier-free guidance.
    """
    model.eval()
    
    # Null conditioning (same shape as prompt)
    null_emb = torch.zeros_like(prompt_emb)
    
    x = torch.full((1, seq_len), model.mask_token_id)
    
    steps = torch.linspace(model.num_diffusion_steps - 1, 0, num_steps)
    
    with torch.no_grad():
        for t in steps:
            # Conditional prediction
            logits_cond = model(x, t, condition=prompt_emb)
            
            # Unconditional prediction
            logits_uncond = model(x, t, condition=null_emb)
            
            # Apply CFG
            logits = logits_uncond + cfg_scale * (logits_cond - logits_uncond)
            
            # Temperature and sampling
            logits = logits / temperature
            probs = F.softmax(logits, dim=-1)
            x = torch.multinomial(probs.view(-1, probs.size(-1)), 1).view(1, -1)
    
    return x

# Try different cfg_scales:
# cfg_scale=1.0: No guidance
# cfg_scale=5.0: Moderate guidance
# cfg_scale=10.0: Strong guidance
# cfg_scale=15.0+: May cause artifacts`}
      </CodeBlock>

      <InfoBox title="Tip" type="success">
        Start with cfg_scale=7.5 and adjust based on results.
        Higher is better adherence but less creativity.
      </InfoBox>
    </>
  ),

  // Module 7: Mercury Architecture
  '7-1-mercury-overview': (
    <>
      <h2>Mercury Overview</h2>
      <p>
        Mercury from Inception Labs is the first production-grade diffusion language model.
        It achieves 10-100x faster inference than autoregressive models with comparable quality.
      </p>

      <h3>Key Innovations</h3>
      <ul>
        <li><strong>Masked Discrete Diffusion</strong>: Tokens are masked rather than noised</li>
        <li><strong>Parallel Generation</strong>: All tokens generated in parallel steps</li>
        <li><strong>Optimized Inference</strong>: Custom CUDA kernels for fast sampling</li>
        <li><strong>Rao-Blackwellized Loss</strong>: Efficient training objective</li>
      </ul>

      <h3>Architecture Highlights</h3>
      <CodeBlock language="python">
{`# Mercury architecture (simplified):

# Key differences from standard MDLM:
# 1. Custom tokenizer optimized for diffusion
# 2. Modified attention patterns
# 3. Adaptive step count based on sequence length
# 4. Custom CUDA kernels for fast inference

class MercuryConfig:
    vocab_size = 100352  # Large vocabulary
    d_model = 4096        # Very large
    num_layers = 40       # Deep
    num_heads = 32
    max_seq_len = 8192    # Long context
    
    # Diffusion settings
    num_diffusion_steps = 10  # Very few steps!
    masking_schedule = "linear"  # Or "adaptive"

# Inference is 10-100x faster than GPT-4 class models
# Because: parallel + few steps + optimized kernels`}
      </CodeBlock>

      <h3>Performance Comparison</h3>
      <table className="w-full my-6 text-sm">
        <thead>
          <tr className="border-b border-zinc-700">
            <th className="text-left py-2">Metric</th>
            <th className="text-left py-2">AR Models</th>
            <th className="text-left py-2">Mercury</th>
          </tr>
        </thead>
        <tbody className="text-zinc-300">
          <tr className="border-b border-zinc-800">
            <td className="py-2">Time to First Token</td><td>High</td><td>~0ms (all at once!)</td>
          </tr>
          <tr className="border-b border-zinc-800">
            <td className="py-2">Latency (1000 tokens)</td><td>~50s</td><td>~0.5-5s</td>
          </tr>
          <tr className="border-b border-zinc-800">
            <td className="py-2">Quality</td><td>Excellent</td><td>Comparable</td>
          </tr>
          <tr className="border-b border-zinc-800">
            <td className="py-2">Throughput</td><td>20 tok/s</td><td>1000+ tok/s</td>
          </tr>
        </tbody>
      </table>

      <InfoBox title="Paper" type="info">
        See &ldquo;Mercury: Ultra-Fast Language Models Based on Diffusion&rdquo; (2025)
        from Inception Labs for full details.
      </InfoBox>
    </>
  ),

  '7-2-discrete-embedding': (
    <>
      <h2>Discrete State Spaces</h2>
      <p>
        Unlike continuous diffusion where denoised values interpolate smoothly,
        text diffusion must handle discrete token spaces. Mercury uses special
        techniques for this.
      </p>

      <h3>The Embedding Challenge</h3>
      <CodeBlock language="python">
{`# Problem: Token indices are discrete (0, 1, 2, ..., vocab_size-1)
# Adding noise (even mask) creates discontinuities

# Solution 1: Embed tokens to continuous space, process, project back
# This is what we&apos;ve been doing!

class DiscreteEmbedding(nn.Module):
    def __init__(self, vocab_size, d_model):
        super().__init__()
        self.embedding = nn.Embedding(vocab_size, d_model)
        self.projection = nn.Linear(d_model, vocab_size)
    
    def forward(self, tokens):
        # tokens (discrete) -> emb (continuous) -> process -> logits (discrete)
        emb = self.embedding(tokens)
        # ... processing ...
        logits = self.projection(output)
        return logits

# Solution 2: Lookup-free embeddings (used in some diffusion models)
# Instead of lookup, use trainable projections
# Pro: Can use continuous noise
# Con: Needs more parameters

# Mercury likely uses hybrid approaches`}
      </CodeBlock>

      <h3>Tokenization for Diffusion</h3>
      <CodeBlock language="python">
{`# Standard tokenizers (BPE, WordPiece) are optimized for AR models
# Diffusion models may benefit from different tokenization

# Considerations:
# 1. Vocabulary size: Larger = more expressive, harder to learn
# 2. Token granularity: Character vs subword vs word
# 3. Special tokens: [MASK], [PAD], [BOS], [EOS]

# Mercury uses:
# - Large vocabulary (~100k tokens)
# - Custom optimized tokenizer
# - Special handling of masking token

# The key insight: diffusion can work with ANY tokenization!
# But some work better than others`}
      </CodeBlock>

      <InfoBox title="Research Direction" type="info">
        How to optimally tokenize for diffusion is still an open question.
        Some work explores learning tokenizers end-to-end with the model.
      </InfoBox>
    </>
  ),

  '7-3-inference-optimization': (
    <>
      <h2>Inference Optimization</h2>
      <p>
        Mercury achieves ultra-fast inference through several optimizations
        that go beyond standard PyTorch implementations.
      </p>

      <h3>Custom CUDA Kernels</h3>
      <CodeBlock language="python">
{`# Mercury uses custom CUDA kernels for:
# 1. Fast attention computation
# 2. Efficient masking/unmasking
# 3. Optimized sampling

# These are written in CUDA C++ or Triton

# Example Triton kernel (pseudocode):
@triton.jit
def masked_softmax_kernel(
    scores,  # (batch, heads, seq, seq)
    mask,
    output,
    scale,
    BLOCK_M: tl.constexpr,
    BLOCK_N: tl.constexpr,
):
    # Block-sparse computation
    # Only compute for masked positions
    # Dramatically faster for sparse operations

# Benefits over standard PyTorch:
# - No Python overhead
# - Fused operations (less memory traffic)
# - Custom memory access patterns`}
      </CodeBlock>

      <h3>Adaptive Step Count</h3>
      <CodeBlock language="python">
{`def adaptive_denoising_steps(sequence_length):
    """
    Mercury uses fewer steps for short sequences.
    """
    # Heuristic: steps scales sub-linearly
    base_steps = 8
    length_factor = max(1, sequence_length / 256)
    
    # Fewer steps for short sequences
    steps = int(base_steps + length_factor ** 0.5)
    
    # Cap at reasonable maximum
    return min(steps, 32)

# Example:
# 128 tokens: ~10 steps
# 512 tokens: ~14 steps  
# 2048 tokens: ~20 steps

# This is why Mercury is so fast!`}
      </CodeBlock>

      <h3>KV Cache Considerations</h3>
      <CodeBlock language="python">
{`# AR models: KV cache stores computed keys/values
# Saves recomputation for each new token

# Diffusion: Different story!
# - No sequential generation (no token-by-token cache)
# - But: Can cache cross-attention to conditioning
# - Can cache transformer computations for iterative refinement

class DiffusionKVCache:
    def __init__(self, model):
        self.kv_cache = {}
    
    def get(self, layer, t):
        return self.kv_cache.get((layer, t))
    
    def set(self, layer, t, kv):
        self.kv_cache[(layer, t)] = kv

# For 10 diffusion steps, can share ~80% of computation`}
      </CodeBlock>

      <InfoBox title="Takeaway" type="success">
        Production diffusion models are heavily optimized.
        For research, start with standard PyTorch and optimize later.
      </InfoBox>
    </>
  ),

  '7-4-replicating-mercury': (
    <>
      <h2>Building a Mercury-Style Model</h2>
      <p>
        Let&apos;s create a simplified Mercury-inspired model incorporating what
        we&apos;ve learned. This will be our capstone project.
      </p>

      <CodeBlock language="python">
{`import torch
import torch.nn as nn
import torch.nn.functional as F

class MercuryLite(nn.Module):
    """
    Simplified Mercury-inspired diffusion language model.
    """
    
    def __init__(
        self,
        vocab_size=50000,
        d_model=512,
        num_heads=8,
        num_layers=12,
        d_ff=2048,
        max_seq_len=1024,
        num_diffusion_steps=10,
        cond_dim=768,
    ):
        super().__init__()
        
        self.vocab_size = vocab_size
        self.mask_token_id = vocab_size  # Last token is mask
        self.num_diffusion_steps = num_diffusion_steps
        
        # Embeddings
        self.token_embedding = nn.Embedding(vocab_size + 1, d_model)
        self.position_embedding = nn.Embedding(max_seq_len, d_model)
        
        # Conditioning
        self.cond_proj = nn.Linear(cond_dim, d_model)
        
        # Transformer blocks with pre-norm
        self.blocks = nn.ModuleList([
            PreNormTransformerBlock(d_model, num_heads, d_ff)
            for _ in range(num_layers)
        ])
        
        # Output
        self.ln_f = nn.LayerNorm(d_model)
        self.lm_head = nn.Linear(d_model, vocab_size, bias=False)
        
        # Weight tying
        self.lm_head.weight = self.token_embedding.weight
        
        # Diffusion schedule
        self.register_buffer(
            'mask_schedule',
            torch.linspace(0, 0.9, num_diffusion_steps)
        )
    
    def get_mask_rate(self, t):
        return self.mask_schedule[t]
    
    def forward(self, x_t, t, condition=None, use_cfg=False, cfg_scale=1.0):
        batch_size, seq_len = x_t.shape
        
        # Token embeddings
        h = self.token_embedding(x_t)
        
        # Position embeddings
        positions = torch.arange(seq_len, device=x_t.device)
        h = h + self.position_embedding(positions)
        
        # Timestep embedding
        t_emb = self.get_timestep_embedding(t, h.size(-1))
        h = h + t_emb.unsqueeze(1)
        
        # Conditioning
        if condition is not None:
            cond_emb = self.cond_proj(condition)
            h = h + cond_emb.unsqueeze(1)
        
        # Transformer blocks
        for block in self.blocks:
            h = block(h)
        
        # Output
        h = self.ln_f(h)
        logits = self.lm_head(h)
        
        return logits
    
    def get_timestep_embedding(self, timesteps, dim):
        half_dim = dim // 2
        emb = torch.log(torch.tensor(10000.0)) / (half_dim - 1)
        emb = torch.exp(torch.arange(half_dim) * -emb)
        emb = timesteps.float()[:, None] * emb[None, :].to(timesteps.device)
        emb = torch.cat([torch.sin(emb), torch.cos(emb)], dim=-1)
        return emb

class PreNormTransformerBlock(nn.Module):
    """Transformer block with pre-normalization (used in modern architectures)."""
    
    def __init__(self, d_model, num_heads, d_ff):
        super().__init__()
        self.norm1 = nn.LayerNorm(d_model)
        self.attn = nn.MultiheadAttention(d_model, num_heads, batch_first=True)
        self.norm2 = nn.LayerNorm(d_model)
        self.ffn = nn.Sequential(
            nn.Linear(d_model, d_ff),
            nn.GELU(),
            nn.Linear(d_ff, d_model),
        )
    
    def forward(self, x):
        # Pre-norm (normalizes before attention, like GPT-3/LLaMA)
        x = x + self.attn(self.norm1(x))[0]
        x = x + self.ffn(self.norm2(x))
        return x

print("MercuryLite model created!")`}
      </CodeBlock>

      <h3>Training</h3>
      <CodeBlock language="python">
{`def train_step(model, batch, optimizer, cfg_dropout=0.1):
    model.train()
    input_ids = batch['input_ids']
    condition = batch['condition']  # Text embeddings
    batch_size = input_ids.size(0)
    
    # Random timesteps
    t = torch.randint(0, model.num_diffusion_steps, (batch_size,))
    
    # Mask rates
    mask_rates = model.mask_schedule[t]
    
    # Create masks
    masks = torch.rand(batch_size, input_ids.size(1)) < mask_rates.unsqueeze(1)
    
    # Apply masks
    x_t = input_ids.clone()
    x_t[masks] = model.mask_token_id
    
    # Randomly drop conditioning (for CFG)
    drop_mask = torch.rand(batch_size) < cfg_dropout
    condition[drop_mask] = 0  # Null conditioning
    
    # Forward
    logits = model(x_t, t, condition=condition)
    
    # Loss on masked positions
    loss = F.cross_entropy(
        logits[masks],
        input_ids[masks],
    )
    
    loss.backward()
    torch.nn.utils.clip_grad_norm_(model.parameters(), 1.0)
    optimizer.step()
    optimizer.zero_grad()
    
    return loss.item()`}
      </CodeBlock>

      <h3>Generation</h3>
      <CodeBlock language="python">
{`def generate(model, prompt_emb, seq_len, cfg_scale=7.0, num_steps=10):
    model.eval()
    
    x = torch.full((1, seq_len), model.mask_token_id)
    null_emb = torch.zeros_like(prompt_emb)
    
    steps = torch.linspace(model.num_diffusion_steps - 1, 0, num_steps).long()
    
    with torch.no_grad():
        for t in steps:
            # CFG
            logits_cond = model(x, t, condition=prompt_emb)
            logits_uncond = model(x, t, condition=null_emb)
            logits = logits_uncond + cfg_scale * (logits_cond - logits_uncond)
            
            # Update unmasked positions
            probs = F.softmax(logits, dim=-1)
            new_tokens = torch.multinomial(probs.view(-1, probs.size(-1)), 1).view(1, -1)
            
            # Keep already-unmasked positions
            x = torch.where(x == model.mask_token_id, new_tokens, x)
    
    return x

# Congratulations! You&apos;ve built a Mercury-inspired model from scratch!`}
      </CodeBlock>

      <InfoBox title="Next Steps" type="success">
        Experiment with model size, step count, and CFG scale.
        Try training on different datasets. Compare to autoregressive baselines!
      </InfoBox>
    </>
  ),

  // Module 8: Evaluation
  '8-1-perplexity': (
    <>
      <h2>Perplexity & Likelihood</h2>
      <p>
        Perplexity is the standard metric for language models. It measures how
        surprised the model is by the test data—lower is better.
      </p>

      <h3>Definition</h3>
      <CodeBlock language="python">
{`import torch
import torch.nn.functional as F

def perplexity(model, dataloader, device='cuda'):
    """
    Compute perplexity of a language model.
    
    Perplexity = exp(average negative log likelihood)
    
    Interpretation:
    - PPL = 10: Model is as uncertain as choosing among 10 options
    - PPL = 100: Model is as uncertain as choosing among 100 options
    - PPL = 1: Perfect prediction (impossible in practice)
    """
    model.eval()
    total_loss = 0
    total_tokens = 0
    
    with torch.no_grad():
        for batch in dataloader:
            input_ids = batch['input_ids'].to(device)
            
            # Forward pass
            logits = model(input_ids)
            
            # Shift for causal LM (predict next token)
            shift_logits = logits[..., :-1, :].contiguous()
            shift_labels = input_ids[..., 1:].contiguous()
            
            # Cross-entropy loss
            loss = F.cross_entropy(
                shift_logits.view(-1, shift_logits.size(-1)),
                shift_labels.view(-1),
                reduction='sum',
            )
            
            total_loss += loss.item()
            total_tokens += shift_labels.numel()
    
    # Perplexity
    avg_nll = total_loss / total_tokens
    ppl = torch.exp(torch.tensor(avg_nll)).item()
    
    return ppl

# For comparison:
# GPT-2 Small: ~50
# GPT-2 Medium: ~30
# GPT-3: ~20
# Human text baseline: ~10-20`}
      </CodeBlock>

      <h3>Bits Per Character (BPC)</h3>
      <p>
        Alternative metric, especially for character-level models.
        Related to perplexity: BPC = log2(PPL)
      </p>

      <CodeBlock language="python">
{`def bits_per_character(ppl):
    """Convert perplexity to bits per character."""
    return torch.log2(torch.tensor(ppl)).item()

# BPC interpretation:
# 1 BPC = model can predict each character as well as 2 choices
# Lower BPC = better

# Human text: ~0.75-1.0 BPC (depending on corpus)
# GPT-2: ~0.8-1.0 BPC on Wikipedia
# State of art: ~0.7 BPC`}
      </CodeBlock>

      <h3>Limitations</h3>
      <ul>
        <li>Perplexity correlates with quality but isn&apos;t everything</li>
        <li>Can be manipulated by assigning high probability to common words</li>
        <li>Doesn&apos;t capture coherence or factual accuracy</li>
      </ul>

      <InfoBox title="Use Perplexity As" type="info">
        A sanity check and quick comparison metric, but always validate
        with downstream task performance and human evaluation.
      </InfoBox>
    </>
  ),

  '8-2-downstream-tasks': (
    <>
      <h2>Downstream Task Evaluation</h2>
      <p>
        Perplexity tells us about language modeling ability, but we care about
        actual task performance. Let&apos;s evaluate on reasoning and understanding tasks.
      </p>

      <h3>Common Benchmarks</h3>
      <CodeBlock language="python">
{`# Standard NLP benchmarks for language models:

# 1. MMLU (Massive Multitask Language Understanding)
# - 57 tasks: science, math, history, etc.
# - Multiple choice questions
# - GPT-3: ~43%, GPT-4: ~86%

# 2. HellaSwag
# - Common sense reasoning
# - Given context, pick best ending
# - GPT-3: ~78%, human: ~95%

# 3. TruthfulQA
# - Tests tendency to reproduce falsehoods
# - GPT-3: ~40%, GPT-4: ~95%

# 4. GSM8K (Grade School Math 8K)
# - Math word problems
# - GPT-3: ~6%, GPT-4: ~90%+ (with chain-of-thought)

# 5. HumanEval
# - Python coding problems
# - GPT-3: ~0%, GPT-4: ~67%`}
      </CodeBlock>

      <h3>Running Evaluations</h3>
      <CodeBlock language="python">
{`from lm_eval import evaluate
from lm_eval.models import HuggingFaceModel

# Evaluate using lm-evaluation-harness
def evaluate_model(model_name_or_path, tasks=['mmlu', 'hellaswag']):
    """
    Evaluate model on standard benchmarks.
    """
    # Load model
    model = HuggingFaceModel(model_name_or_path)
    
    # Run evaluation
    results = evaluate(
        model=model,
        tasks=tasks,
        batch_size=8,
    )
    
    return results

# Example:
# results = evaluate_model('gpt2', tasks=['hellaswag'])
# print(results['results']['hellaswag'])`}
      </CodeBlock>

      <h3>Evaluating Diffusion Models</h3>
      <CodeBlock language="python">
{`# Diffusion models need special handling for evaluation

# For perplexity:
# Option 1: Importance-weighted estimation
# Sample masks at various ratios, compute likelihood bounds

# For downstream tasks:
# Option 1: Few-shot prompting with generated completions
# Option 2: Fine-tune for specific tasks (less common)

def evaluate_diffusion_on_mmlu(model, num_few_shot=5):
    """
    Evaluate diffusion model on MMLU.
    
    Steps:
    1. Generate completion for question
    2. Extract answer (A, B, C, or D)
    3. Compare to ground truth
    """
    # Generate with prompt
    prompt = format_mmlu_question(question, few_shot_examples)
    completion = generate(model, prompt)
    
    # Extract answer
    answer = extract_answer(completion)
    
    return correct / total

# Note: Diffusion models often underperform AR on reasoning tasks
# This is an active research area!`}
      </CodeBlock>

      <InfoBox title="Current State" type="info">
        Diffusion language models are catching up to AR models on benchmarks.
        Mercury shows promising results but evaluation is still evolving.
      </InfoBox>
    </>
  ),

  '8-3-human-evaluation': (
    <>
      <h2>Human Evaluation & Win Rates</h2>
      <p>
        Automated metrics don&apos;t capture everything. Human evaluation remains
        the gold standard for measuring text quality.
      </p>

      <h3>Chatbot Arena (ELO)</h3>
      <p>
        LMSYS Chatbot Arena uses human preferences to create ELO ratings—
        the same system used for chess ratings.
      </p>

      <CodeBlock language="python">
{`# How Chatbot Arena works:

# 1. Human judges see responses from two models (anonymized)
# 2. They choose: Model A wins, Model B wins, or Tie
# 3. ELO rating updated based on outcomes

# ELO system:
# - 400 ELO difference = 10x more likely to win
# - New models start at 1000 ELO
# - Human baseline ~1300 ELO

# Example ELO ratings (approximate):
# GPT-4: ~1340
# Claude-2: ~1300
# GPT-3.5: ~1200
# LLaMA-2-70B: ~1150

# To submit to Arena:
# - Deploy model to API
# - Wait for human evaluations
# - Get your ELO rating`}
      </CodeBlock>

      <h3>Running Your Own Human Eval</h3>
      <CodeBlock language="python">
{`# Simple A/B testing framework

class HumanEvaluator:
    def __init__(self, model_a, model_b):
        self.model_a = model_a
        self.model_b = model_b
        self.results_a_wins = 0
        self.results_b_wins = 0
        self.results_ties = 0
    
    def compare(self, prompt, judge):
        """
        Compare models on a single prompt.
        
        Args:
            prompt: Input prompt
            judge: Human judge function
                   Returns 'a', 'b', or 'tie'
        """
        response_a = generate(self.model_a, prompt)
        response_b = generate(self.model_b, prompt)
        
        winner = judge(prompt, response_a, response_b)
        
        if winner == 'a':
            self.results_a_wins += 1
        elif winner == 'b':
            self.results_b_wins += 1
        else:
            self.results_ties += 1
    
    def report(self):
        total = self.results_a_wins + self.results_b_wins + self.results_ties
        return {
            'A win rate': self.results_a_wins / total,
            'B win rate': self.results_b_wins / total,
            'Tie rate': self.results_ties / total,
        }

# For rigorous evaluation:
# - Use diverse prompts
# - Have multiple judges
# - Blind the judges to model identity
# - Control for response length`}
      </CodeBlock>

      <h3>What to Look For</h3>
      <ul>
        <li><strong>Helpfulness</strong>: Does the response answer the question?</li>
        <li><strong>Accuracy</strong>: Is the information correct?</li>
        <li><strong>Coherence</strong>: Is the text well-structured?</li>
        <li><strong>Fluency</strong>: Is it grammatically correct?</li>
        <li><strong>Safety</strong>: Does it avoid harmful content?</li>
      </ul>

      <InfoBox title="Best Practice" type="success">
        Combine automated metrics (perplexity, benchmark scores) with
        targeted human evaluation for a complete picture of model quality.
      </InfoBox>

      <h3>Congratulations on Completing the Course!</h3>
      <p>
        You&apos;ve learned the foundations of diffusion language models, from
        transformer basics to building a Mercury-inspired model. Keep experimenting!
      </p>
    </>
  ),
};
