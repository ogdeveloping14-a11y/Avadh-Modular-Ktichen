const BUSINESS = {
  name: "Avdh Modular Kitchen and Furniture",
  PHONE_NUMBER: "918172845623",
  whatsappMessage: "Hello, I would like to enquire about modular kitchen and furniture work."
};

function initBusinessLinks() {
  const hasPhone = /^\d{10,15}$/.test((BUSINESS.PHONE_NUMBER || "").replace(/\D/g, ""));
  const number = (BUSINESS.PHONE_NUMBER || "").replace(/\D/g, "");
  document.querySelectorAll("[data-call-link]").forEach(el => {
    if (hasPhone) {
      el.href = `tel:+${number}`;
      el.removeAttribute("aria-disabled");
    } else {
      el.href = "#contact";
      el.setAttribute("aria-label", "Contact Avdh");
    }
  });
  document.querySelectorAll("[data-whatsapp-link]").forEach(el => {
    if (hasPhone) {
      el.href = `https://wa.me/${number}?text=${encodeURIComponent(BUSINESS.whatsappMessage)}`;
      el.target = "_blank";
      el.rel = "noopener";
    } else {
      el.href = "#contact";
    }
  });
}
document.addEventListener("DOMContentLoaded", initBusinessLinks);
