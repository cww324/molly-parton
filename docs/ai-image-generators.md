# AI Image Generators Guide

Overview of AI image generation tools, with a focus on training custom models for consistent brand aesthetics.

## Cloud-Based Generators

### Midjourney
**Best for:** Highest quality artistic images

| Pros | Cons |
|------|------|
| Best overall quality | Discord-only interface |
| Great artistic styles | $10/month minimum |
| Active community | Can't train custom models |
| Fast generation | Learning curve with parameters |

**How to use:**
1. Join Discord: https://discord.gg/midjourney
2. Subscribe at midjourney.com
3. Use `/imagine` command with your prompt
4. Use `--style raw` for less "Midjourney look"
5. Use `--ar 1:1` for square t-shirt designs

**Useful parameters:**
```
/imagine prompt: your prompt here --ar 1:1 --style raw --v 6
```

---

### Ideogram
**Best for:** Text in images (logos, typography designs)

| Pros | Cons |
|------|------|
| Best text rendering | Less artistic range |
| Free tier (25/day) | Newer, smaller community |
| Web-based, easy UI | Can be inconsistent |
| Good for logos | |

**Website:** https://ideogram.ai

**Use when:** Your design needs readable text that's part of the image.

---

### Leonardo.ai
**Best for:** Free tier, fine-tuned models, iteration

| Pros | Cons |
|------|------|
| Generous free tier | Quality varies by model |
| Many specialized models | Can feel overwhelming |
| Train your own models | UI is cluttered |
| Web-based | |

**Website:** https://leonardo.ai

**Good models for t-shirts:**
- Vintage Style Photography
- Illustration V2
- Graphic Design Pop Art

---

### DALL-E 3 (via ChatGPT)
**Best for:** Ease of use, conversational iteration

| Pros | Cons |
|------|------|
| Natural language prompts | Less control over style |
| Edit via conversation | $20/month (ChatGPT Plus) |
| Good text handling | Can be "safe" / generic |
| Understands context | |

**How to use:**
1. Subscribe to ChatGPT Plus
2. Just describe what you want in conversation
3. Ask for variations and edits naturally

---

### Adobe Firefly
**Best for:** Commercial safety, Adobe integration

| Pros | Cons |
|------|------|
| Trained on licensed content | More generic results |
| Safe for commercial use | Less artistic |
| Integrates with Photoshop | |
| Good for backgrounds | |

**Website:** https://firefly.adobe.com

---

## Local Generation (Free, Private, Unlimited)

### Why Run Locally?

- **Free** after initial setup
- **No content filters** (full creative freedom)
- **Train custom models** on your aesthetic
- **Private** - your prompts never leave your machine
- **Unlimited** generations

### Hardware Requirements

**Minimum:**
- NVIDIA GPU with 6GB VRAM
- 16GB RAM
- 20GB disk space

**Recommended:**
- NVIDIA GPU with 8-12GB VRAM (RTX 3060 12GB, RTX 3070, RTX 4070)
- 32GB RAM
- SSD with 100GB+ free space

**Your machine:** RTX 3070 Ti (8GB) - Perfect for this.

---

### Option 1: Fooocus (Easiest)

Midjourney-like results with zero configuration.

**Install on Windows:**
1. Download: https://github.com/lllyasviel/Fooocus/releases
2. Extract the zip
3. Run `run.bat`
4. Browser opens automatically
5. Start generating

**That's it.** No Python, no command line, no config.

**Pros:** Dead simple, great defaults, Midjourney-quality
**Cons:** Less control than other options

---

### Option 2: Automatic1111 (Most Popular)

The standard for Stable Diffusion. More control, bigger community.

**Install on Windows:**
1. Download: https://github.com/AUTOMATIC1111/stable-diffusion-webui/releases
2. Extract and run `webui-user.bat`
3. First run downloads models (~4GB)
4. Access at http://127.0.0.1:7860

**Pros:** Huge extension ecosystem, lots of tutorials
**Cons:** More complex, can be slow

---

### Option 3: ComfyUI (Most Powerful)

Node-based interface. Maximum control, steeper learning curve.

**Install:**
1. Download: https://github.com/comfyanonymous/ComfyUI/releases
2. Extract and run
3. Build workflows by connecting nodes

**Pros:** Most flexible, best for complex workflows
**Cons:** Learning curve, not beginner-friendly

---

## Training Your Own Model

This is where it gets cool. Train a model on your aesthetic so every generation matches your brand.

### Methods (Easiest to Hardest)

#### 1. LoRA (Low-Rank Adaptation) - Recommended

Small model that learns a specific style or concept. Applies on top of base model.

**What you need:**
- 10-30 images in your target style
- GPU with 8GB+ VRAM (your 3070 Ti works)
- 1-2 hours training time

**Process:**
1. Collect 10-30 reference images (consistent style)
2. Caption each image (describe what's in it)
3. Train LoRA using Kohya_ss GUI
4. Use trained LoRA with any Stable Diffusion setup

**Tools:**
- **Kohya_ss GUI** - https://github.com/bmaltais/kohya_ss
  - Windows installer available
  - GUI for training, no code needed

**Settings for style LoRA:**
```
Training steps: 1500-3000
Learning rate: 1e-4
Network rank: 32-64
Network alpha: 16-32
```

#### 2. Textual Inversion / Embeddings

Teaches the model a new "word" that represents your style.

**What you need:**
- 5-15 images
- Less VRAM than LoRA
- 30min - 2 hours training

**Easier but less powerful than LoRA.**

#### 3. DreamBooth

Fine-tunes the entire model. Highest quality, most resource intensive.

**What you need:**
- 20-50 images
- 12GB+ VRAM (your 3070 Ti is borderline)
- 2-4 hours training
- More disk space

**Usually overkill for style training.** LoRA is better for most cases.

---

### Training Workflow for Molly Parton Brand

**Step 1: Collect Reference Images**
- Generate 50+ images using cloud tools (Midjourney, etc.)
- Curate down to 15-30 that perfectly match your vision
- Should have consistent style, colors, vibe

**Step 2: Prepare Training Data**
```
training_images/
├── 01_cosmic_cowgirl.png
├── 02_festival_dancer.png
├── 03_psychedelic_boots.png
...
```

**Step 3: Caption Images**
Each image needs a text file with the same name:
```
01_cosmic_cowgirl.txt:
"mollyparton style, retro illustration of cosmic cowgirl,
big blonde hair, neon colors, psychedelic, bold outlines"
```

Include a **trigger word** like "mollyparton style" in every caption.

**Step 4: Train LoRA**
Using Kohya_ss:
1. Install Kohya_ss GUI
2. Select your images folder
3. Set training parameters
4. Click train
5. Wait 1-2 hours

**Step 5: Use Your LoRA**
In Automatic1111 or ComfyUI:
```
prompt: mollyparton style, dancing woman at festival,
bold outlines, limited colors, t-shirt design
```

The model now knows what "mollyparton style" means.

---

### Quick Start: Training Your First LoRA

**Prerequisites:**
1. Install Automatic1111 or Fooocus
2. Download Kohya_ss: https://github.com/bmaltais/kohya_ss
3. Gather 15-20 style reference images

**Using Kohya_ss GUI:**

1. **Launch** - Run `gui.bat`

2. **LoRA Tab** - Select "LoRA" training type

3. **Folders:**
   - Image folder: where your training images are
   - Output folder: where to save the trained LoRA
   - Model: select "sd_xl_base_1.0" or similar

4. **Training Config:**
   ```
   Resolution: 1024 (for SDXL) or 512 (for SD 1.5)
   Batch size: 1
   Epochs: 10-20
   Learning rate: 1e-4
   Network rank: 32
   Network alpha: 16
   ```

5. **Train** - Click start, wait 1-2 hours

6. **Result** - `.safetensors` file in output folder

7. **Use it** - Put in `models/Lora/` folder, reference in prompts

---

## Recommended Setup for Molly Parton

**Phase 1: Exploration**
- Use Midjourney to find your style
- Generate lots, curate favorites
- Build a reference library

**Phase 2: Production**
- Set up Fooocus locally (free, unlimited)
- Use curated images to train LoRA
- Generate consistent on-brand designs

**Phase 3: Scale**
- ComfyUI for batch generation
- Multiple LoRAs for different product lines
- Automated workflows

---

## Resources

**Learning:**
- r/StableDiffusion - Active community, troubleshooting
- https://civitai.com - Download models and LoRAs
- https://stable-diffusion-art.com - Tutorials

**Models to Download:**
- SDXL 1.0 - Latest base model
- Juggernaut XL - Great for illustrations
- DreamShaper XL - Good all-rounder

**LoRA Training:**
- Kohya_ss: https://github.com/bmaltais/kohya_ss
- Guide: https://stable-diffusion-art.com/lora-training/
