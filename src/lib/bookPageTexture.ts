import * as THREE from 'three';

const W = 512;
const H = 704;

export type PageDrawContent = {
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
  if (words.length && lines.length === maxLines && line !== lines[lines.length - 1]) {
    const last = lines[lines.length - 1];
    lines[lines.length - 1] = last.length > 3 ? `${last.slice(0, -3)}…` : `${last}…`;
  }
  return lines;
}

function drawTextPage(ctx: CanvasRenderingContext2D, content: PageDrawContent) {
  ctx.fillStyle = '#f4f7f5';
  ctx.fillRect(0, 0, W, H);

  const pad = 36;
  let y = pad + 8;

  if (content.image) {
    // image slot border while loading / if missing
    ctx.fillStyle = '#e2e8f0';
    ctx.fillRect(pad, y, W - pad * 2, 140);
    y += 156;
  }

  if (content.isCover) {
    ctx.textAlign = 'center';
    ctx.fillStyle = '#0f172a';
    ctx.font = 'bold 28px Inter, system-ui, sans-serif';
    const titleLines = wrapLines(ctx, content.title, W - pad * 2, 3);
    titleLines.forEach((ln) => {
      ctx.fillText(ln, W / 2, y, W - pad * 2);
      y += 34;
    });
    y += 8;
    ctx.fillStyle = '#047857';
    ctx.font = '500 16px "JetBrains Mono", monospace';
    ctx.fillText(content.body, W / 2, y);
    y += 28;
    if (content.meta) {
      ctx.fillStyle = '#64748b';
      ctx.font = '14px Inter, system-ui, sans-serif';
      ctx.fillText(content.meta, W / 2, H - pad);
    }
    return;
  }

  ctx.textAlign = 'left';
  ctx.fillStyle = '#047857';
  ctx.font = '600 11px "JetBrains Mono", monospace';
  ctx.fillText(`PRINCIPLE ${content.index ?? ''}`, pad, y);
  y += 22;

  ctx.fillStyle = '#0f172a';
  ctx.font = 'bold 20px Inter, system-ui, sans-serif';
  wrapLines(ctx, content.title, W - pad * 2, 2).forEach((ln) => {
    ctx.fillText(ln, pad, y);
    y += 26;
  });
  y += 6;

  ctx.fillStyle = '#334155';
  ctx.font = '15px Inter, system-ui, sans-serif';
  wrapLines(ctx, content.body, W - pad * 2, 9).forEach((ln) => {
    ctx.fillText(ln, pad, y);
    y += 22;
  });

  if (content.meta) {
    ctx.strokeStyle = 'rgba(4,120,87,0.2)';
    ctx.beginPath();
    ctx.moveTo(pad, H - pad - 20);
    ctx.lineTo(W - pad, H - pad - 20);
    ctx.stroke();
    ctx.fillStyle = '#047857';
    ctx.font = '13px Inter, system-ui, sans-serif';
    ctx.fillText(`— ${content.meta}`, pad, H - pad);
  }

  ctx.textAlign = 'center';
}

export function paintPageCanvas(canvas: HTMLCanvasElement, content: PageDrawContent): Promise<void> {
  canvas.width = W;
  canvas.height = H;
  const ctx = canvas.getContext('2d');
  if (!ctx) return Promise.resolve();

  drawTextPage(ctx, content);

  if (!content.image) return Promise.resolve();

  return new Promise((resolve) => {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => {
      const pad = 36;
      const iw = W - pad * 2;
      const ih = 140;
      ctx.drawImage(img, pad, pad + 8, iw, ih);
      resolve();
    };
    img.onerror = () => resolve();
    img.src = content.image!;
  });
}

export function createPageTexture(content: PageDrawContent): {
  texture: THREE.CanvasTexture;
  canvas: HTMLCanvasElement;
  refresh: () => Promise<void>;
} {
  const canvas = document.createElement('canvas');
  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.minFilter = THREE.LinearFilter;
  texture.magFilter = THREE.LinearFilter;

  const refresh = async () => {
    await paintPageCanvas(canvas, content);
    texture.needsUpdate = true;
  };

  return { texture, canvas, refresh };
}
