import * as THREE from 'three';

const W = 1024;
const H = 640;
const IMG_RATIO = 0.62;

export type ScreenContent = {
  title: string;
  body: string;
  meta?: string;
  image?: string;
  isCover?: boolean;
  index?: number;
};

function wrapLines(ctx: CanvasRenderingContext2D, text: string, maxWidth: number, maxLines: number) {
  const words = text.split(/\s+/);
  const lines: string[] = [];
  let line = '';
  for (const word of words) {
    const test = line ? `${line} ${word}` : word;
    if (ctx.measureText(test).width > maxWidth && line) {
      lines.push(line);
      line = word;
      if (lines.length >= maxLines) break;
    } else {
      line = test;
    }
  }
  if (line && lines.length < maxLines) lines.push(line);
  return lines;
}

function drawImageCover(ctx: CanvasRenderingContext2D, img: HTMLImageElement, w: number, h: number) {
  const ir = img.width / img.height;
  const r = w / h;
  let dw: number;
  let dh: number;
  if (ir > r) {
    dh = h;
    dw = dh * ir;
  } else {
    dw = w;
    dh = dw / ir;
  }
  const ox = (w - dw) / 2;
  const oy = (h - dh) / 2;
  ctx.drawImage(img, ox, oy, dw, dh);
}

function drawTextLayer(ctx: CanvasRenderingContext2D, content: ScreenContent) {
  const imgH = Math.floor(H * IMG_RATIO);
  const pad = 28;
  const textTop = imgH + 16;

  ctx.fillStyle = 'rgba(2,6,23,0.94)';
  ctx.fillRect(0, imgH, W, H - imgH);

  if (content.isCover) {
    ctx.textAlign = 'center';
    ctx.fillStyle = '#34d399';
    ctx.font = '600 14px "JetBrains Mono", monospace';
    ctx.fillText('OPERATOR CODEX', W / 2, textTop + 8);
    ctx.fillStyle = '#f8fafc';
    ctx.font = 'bold 32px Inter, system-ui, sans-serif';
    wrapLines(ctx, content.title, W - pad * 2, 2).forEach((ln, i) => {
      ctx.fillText(ln, W / 2, textTop + 44 + i * 36);
    });
    ctx.fillStyle = '#94a3b8';
    ctx.font = '18px Inter, system-ui, sans-serif';
    ctx.fillText(content.body, W / 2, textTop + 130);
    if (content.meta) {
      ctx.fillStyle = '#64748b';
      ctx.font = '14px Inter, system-ui, sans-serif';
      ctx.fillText(content.meta, W / 2, H - pad);
    }
    return;
  }

  ctx.textAlign = 'left';
  ctx.fillStyle = '#34d399';
  ctx.font = '600 13px "JetBrains Mono", monospace';
  ctx.fillText(`PRINCIPLE ${content.index ?? ''}`, pad, textTop + 6);
  ctx.fillStyle = '#f8fafc';
  ctx.font = 'bold 24px Inter, system-ui, sans-serif';
  wrapLines(ctx, content.title, W - pad * 2, 2).forEach((ln, i) => {
    ctx.fillText(ln, pad, textTop + 34 + i * 30);
  });
  ctx.fillStyle = '#cbd5e1';
  ctx.font = '17px Inter, system-ui, sans-serif';
  wrapLines(ctx, content.body, W - pad * 2, 4).forEach((ln, i) => {
    ctx.fillText(ln, pad, textTop + 100 + i * 24);
  });
  if (content.meta) {
    ctx.fillStyle = '#34d399';
    ctx.font = '14px Inter, system-ui, sans-serif';
    ctx.fillText(`— ${content.meta}`, pad, H - pad);
  }
}

export async function paintMonitorScreen(canvas: HTMLCanvasElement, content: ScreenContent): Promise<void> {
  canvas.width = W;
  canvas.height = H;
  const ctx = canvas.getContext('2d');
  if (!ctx) return;

  const imgH = Math.floor(H * IMG_RATIO);
  ctx.fillStyle = '#020617';
  ctx.fillRect(0, 0, W, H);

  const loadImage = () =>
    new Promise<HTMLImageElement | null>((resolve) => {
      if (!content.image) return resolve(null);
      const img = new Image();
      img.onload = () => resolve(img);
      img.onerror = () => resolve(null);
      img.src = content.image;
    });

  const img = await loadImage();
  if (img) {
    ctx.save();
    ctx.beginPath();
    ctx.rect(0, 0, W, imgH);
    ctx.clip();
    drawImageCover(ctx, img, W, imgH);
    ctx.restore();
    const grad = ctx.createLinearGradient(0, imgH - 80, 0, imgH);
    grad.addColorStop(0, 'rgba(2,6,23,0)');
    grad.addColorStop(1, 'rgba(2,6,23,0.9)');
    ctx.fillStyle = grad;
    ctx.fillRect(0, imgH - 80, W, 80);
  }

  drawTextLayer(ctx, content);
}

export function createMonitorTexture(content: ScreenContent) {
  const canvas = document.createElement('canvas');
  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.minFilter = THREE.LinearFilter;
  texture.magFilter = THREE.LinearFilter;
  return {
    texture,
    canvas,
    refresh: () => paintMonitorScreen(canvas, content).then(() => { texture.needsUpdate = true; }),
  };
}
