const sharp = require("sharp");
const path = require("path");
const fs = require("fs");

const SRC = path.join(__dirname, "..", "assents");
const OUT = path.join(__dirname, "..", "images");
fs.mkdirSync(OUT, { recursive: true });

// products photographed on pure white seamless -> trim to tight crop
const trimList = new Set([
  "controlador-de-acesso-facial-com-biometria-digital-ss-3542-mf.webp",
  "controle de acesso intelbras.png",
  "kit cftv intelbras.webp",
  "kit-cercaeletrica-intelbras.png",
  "motor-basculante-ppa.webp",
  "motor-deslizante ppa.webp",
  "porteirosimples-intelbras.webp",
  "sistema-8000-sistema-de-alarme-sem-fio.webp",
  "sistema-alarmesimples-intelbras.webp",
  "video porteiro - intelbras.jpg",
]);

const jobs = [
  { file: "central monitoramento.jpg", out: "hero-central", widths: [1600, 900] },
  { file: "cerca-eletrica-intelbras.webp", out: "cerca-eletrica", widths: [900, 600] },
  { file: "concertina 1.jpg", out: "concertina-1", widths: [900, 600] },
  { file: "concertina 2.webp", out: "concertina-2", widths: [900, 600] },
  { file: "concertina 3.webp", out: "concertina-3", widths: [900, 600] },
  { file: "cancela-ppa.webp", out: "cancela-ppa", widths: [900, 600] },
  { file: "camera-intelbras.jpg", out: "camera-intelbras", widths: [900, 600] },
  { file: "cameraim7-intelbras.webp", out: "cameraim7-intelbras", widths: [900, 600] },
  { file: "controlador-de-acesso-facial-com-biometria-digital-ss-3542-mf.webp", out: "controlador-facial", widths: [900, 600] },
  { file: "controle de acesso intelbras.png", out: "controle-acesso-a", widths: [900, 600] },
  { file: "controle de acesso-intelbras.webp", out: "controle-acesso-b", widths: [900, 600] },
  { file: "kit cftv intelbras.webp", out: "kit-cftv", widths: [900, 600] },
  { file: "kit-cercaeletrica-intelbras.png", out: "kit-cerca-eletrica", widths: [900, 600] },
  { file: "motor-basculante-ppa.webp", out: "motor-basculante", widths: [900, 600] },
  { file: "motor-deslizante ppa.webp", out: "motor-deslizante", widths: [900, 600] },
  { file: "porteirosimples-intelbras.webp", out: "porteiro-simples", widths: [900, 600] },
  { file: "sistema-8000-sistema-de-alarme-sem-fio.webp", out: "sistema-alarme-8000", widths: [900, 600] },
  { file: "sistema-alarmesimples-intelbras.webp", out: "sistema-alarme-simples", widths: [900, 600] },
  { file: "video porteiro - intelbras.jpg", out: "video-porteiro", widths: [900, 600] },
  { file: "logo-2-Photoroom.png", out: "logo-mark", widths: [640, 320, 160], keepAlpha: true },
  { file: "logo-intelbras.png", out: "brand-intelbras", widths: [400], keepAlpha: true },
  { file: "_Logotipo-PPA-2021_1684334289702.webp", out: "brand-ppa", widths: [400], keepAlpha: true },
  { file: "logo-hikvision-transparent.png", out: "brand-hikvision", widths: [400], keepAlpha: true },
];

(async () => {
  for (const job of jobs) {
    const srcPath = path.join(SRC, job.file);
    if (!fs.existsSync(srcPath)) {
      console.log("MISSING", job.file);
      continue;
    }
    let pipeline = sharp(srcPath, { failOn: "none" });
    if (trimList.has(job.file)) {
      pipeline = pipeline.trim({ threshold: 12 });
    }
    const meta = await pipeline.clone().metadata();
    for (const w of job.widths) {
      const width = Math.min(w, meta.width || w);
      const outPath = path.join(OUT, `${job.out}-${w}.webp`);
      await pipeline
        .clone()
        .resize({ width, withoutEnlargement: true })
        .webp({ quality: job.keepAlpha ? 92 : 82, alphaQuality: 95 })
        .toFile(outPath);
      const size = fs.statSync(outPath).size;
      console.log(job.out, w, (size / 1024).toFixed(0) + "kb");
    }
  }
})();
