const envelope = document.querySelector(".envelope");
const petalLayer = document.querySelector(".petal-layer");
const photoGrid = document.querySelector(".photo-grid");
const answerMessage = document.querySelector(".answer-message");
const answerButtons = document.querySelectorAll("[data-answer]");

const curatedPhotos = [
  {
    src: "assets/photos/IMG_4897.jpg",
    caption: "Khoảnh khắc anh muốn giữ thật lâu",
    layout: "is-featured",
    position: "50% 48%"
  },
  {
    src: "assets/photos/IMG_4912.jpg",
    caption: "Một ngày mưa cũng hóa dịu dàng",
    layout: "is-portrait",
    position: "50% 32%"
  },
  {
    src: "assets/photos/IMG_4773.jpg",
    caption: "Đêm ấy có Vy, mọi thứ tự nhiên đẹp hơn",
    layout: "is-wide",
    position: "54% 46%"
  },
  {
    src: "assets/photos/IMG_5344.PNG",
    caption: "Một cuộc gọi cũng thành kỷ niệm",
    layout: "is-phone",
    position: "50% 52%"
  },
  {
    src: "assets/photos/IMG_5377.jpg",
    caption: "Một chút đáng yêu rất riêng của Vy",
    layout: "is-close",
    position: "58% 44%"
  },
  {
    src: "assets/photos/att.PbePaHDnrlHzgg9rnyc5q3k8VvciwpXz_MZaiirs8m0.JPG",
    caption: "Nụ cười làm anh nhớ mãi",
    layout: "is-memory",
    position: "58% 42%"
  }
];

function createPetal() {
  if (!petalLayer || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

  const petal = document.createElement("span");
  const start = Math.random() * 100;
  const drift = (Math.random() * 220 - 110).toFixed(0);
  const duration = (Math.random() * 6 + 7).toFixed(2);
  const rotate = (Math.random() * 180).toFixed(0);

  petal.className = "petal";
  petal.style.left = `${start}vw`;
  petal.style.setProperty("--drift", `${drift}px`);
  petal.style.setProperty("--duration", `${duration}s`);
  petal.style.setProperty("--rotate", `${rotate}deg`);

  petalLayer.appendChild(petal);
  petal.addEventListener("animationend", () => petal.remove(), { once: true });
}

function pulsePetals(count = 14) {
  for (let i = 0; i < count; i += 1) {
    window.setTimeout(createPetal, i * 90);
  }
}

function testImage(src) {
  return new Promise((resolve) => {
    const image = new Image();
    image.onload = () => resolve(src);
    image.onerror = () => resolve(null);
    image.src = src;
  });
}

function makePhotoCard(photo, index, isPlaceholder = false) {
  const card = document.createElement("article");
  card.className = `photo-card ${photo.layout || ""} reveal`;

  if (isPlaceholder) {
    const placeholder = document.createElement("div");
    placeholder.className = "photo-placeholder";
    placeholder.innerHTML = "<span>Vy</span>";
    card.appendChild(placeholder);
  } else {
    const image = document.createElement("img");
    image.src = photo.src;
    image.alt = `Ảnh của Nguyễn Phương Vy ${index + 1}`;
    image.loading = "lazy";
    card.style.setProperty("--photo-position", photo.position || "50% 50%");
    card.appendChild(image);
  }

  const caption = document.createElement("div");
  caption.className = "photo-caption";
  caption.textContent = photo.caption || "Một khoảnh khắc thật đẹp của Vy";
  card.appendChild(caption);
  return card;
}

async function loadPhotos() {
  if (!photoGrid) return;

  const results = await Promise.all(curatedPhotos.map((photo) => testImage(photo.src)));
  const photos = curatedPhotos.filter((_, index) => results[index]);
  const cards = photos.length
    ? photos.map((photo, index) => makePhotoCard(photo, index))
    : Array.from({ length: 6 }, (_, index) => makePhotoCard({ layout: "is-close" }, index, true));

  photoGrid.replaceChildren(...cards);
  observeReveals();
}

function observeReveals() {
  const revealItems = document.querySelectorAll(".reveal");

  if (!("IntersectionObserver" in window)) {
    revealItems.forEach((item) => item.classList.add("visible"));
    return;
  }

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("visible");
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.16 });

  revealItems.forEach((item) => observer.observe(item));
}

if (envelope) {
  envelope.addEventListener("click", () => {
    const isOpen = envelope.classList.toggle("open");
    envelope.setAttribute("aria-expanded", String(isOpen));
    if (isOpen) pulsePetals(18);
  });
}

answerButtons.forEach((button) => {
  button.addEventListener("click", () => {
    const answer = button.dataset.answer;

    if (answer === "yes") {
      answerMessage.textContent = "Cảm ơn Vy. Anh sẽ trân trọng cơ hội này bằng tất cả sự chân thành của mình.";
      pulsePetals(32);
      return;
    }

    answerMessage.textContent = "Không sao cả. Anh sẽ đợi câu trả lời của Vy bằng sự tôn trọng và thật lòng.";
    pulsePetals(10);
  });
});

document.querySelectorAll(".letter-paper, .promise-panel, .question-section").forEach((item) => {
  item.classList.add("reveal");
});

loadPhotos();
observeReveals();
window.setInterval(createPetal, 1800);
