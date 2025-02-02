document.addEventListener("DOMContentLoaded", () => {
  // Sélecteurs principaux
  const mainElement = document.getElementById("main");
  const btnToggleTheme = document.querySelector(".btn-toggle-theme");
  const logo = document.querySelector(".logo img");
  const themeIcon = btnToggleTheme.querySelector(".material-symbols-rounded");
  const textarea = document.getElementById("chaine");
  const charEmpty = document.getElementById("charEmpty");
  const charTotal = document.getElementById("charCount");
  const wordCount = document.getElementById("wordCount");
  const sentenceCount = document.getElementById("sentenceCount");
  const densityChart = document.getElementById("density-chart");
  const showMoreOrLessButton = document.getElementById("showMoreOrLess");
  const showMoreOrLessText = showMoreOrLessButton.querySelector("span");
  const showMoreOrLessIcon = showMoreOrLessButton.querySelector(
    ".material-symbols-rounded"
  );
  const excludeSpacesButton = document.getElementById("excludeSpaces");
  const setLimitButton = document.getElementById("limitChar");

  // Variables d'état
  let originalText = "";
  let excludeSpacesActive = false;
  let setLimitActive = false;
  let isShowingMore = false;

  // Basculer entre les thèmes
  const toggleTheme = () => {
    const isDark = mainElement.classList.toggle("dark");
    logo.src = isDark
      ? "/images/logo-dark-theme.svg"
      : "/images/logo-light-theme.svg";
    themeIcon.textContent = isDark ? "light_mode" : "dark_mode";
  };

  // Mettre à jour les statistiques de texte
  const updateCharStats = () => {
    const text = textarea.value;
    const charCountValue = text.length;
    const wordCountValue = text.trim().split(/\s+/).filter(Boolean).length;
    const sentenceCountValue = text.split(/[.!?]/).filter(Boolean).length;

    charEmpty.style.display = charCountValue === 0 ? "block" : "none";
    charTotal.textContent = charCountValue.toString().padStart(2, "0");
    wordCount.textContent = wordCountValue.toString().padStart(2, "0");
    sentenceCount.textContent = sentenceCountValue.toString().padStart(2, "0");
  };

  // Mettre à jour la densité des lettres
  const updateLetterDensity = () => {
    const text = textarea.value.toUpperCase().replace(/[^A-Z]/g, "");
    const totalLetters = text.length;
    const letterCounts = [...text].reduce((acc, char) => {
      acc[char] = (acc[char] || 0) + 1;
      return acc;
    }, {});

    const sortedCounts = Object.entries(letterCounts).sort(
      (a, b) => b[1] - a[1]
    );
    const limit = isShowingMore ? sortedCounts.length : 5;
    const topLetters = sortedCounts.slice(0, limit);

    showMoreOrLessButton.style.display =
      sortedCounts.length > 5 ? "flex" : "none";
    densityChart.innerHTML = topLetters
      .map(([letter, count]) => {
        const percentage = ((count / totalLetters) * 100).toFixed(2);
        return `
          <div class="letter-bar flex items-center gap-2 mb-2">
            <div class="w-full items-center gap-3.5 inline-flex">
              <div class="justify-center items-center gap-2.5 flex">
                <div class="w-4 txt-secondary text-base font-normal leading-tight">${letter}</div>
              </div>
              <div class="progress-bar rounded-full h-3 flex-1">
                <div class="filled-bar h-3 rounded-full" style="width: ${percentage}%;"></div>
              </div>
              <div class="text-right txt-secondary text-base font-normal leading-tight">${count} (${percentage}%)</div>
            </div>
          </div>`;
      })
      .join("");
  };

  // Basculer entre "See more" et "See less"
  const toggleShowMoreOrLess = () => {
    isShowingMore = !isShowingMore;
    showMoreOrLessText.textContent = isShowingMore ? "See less" : "See more";
    showMoreOrLessIcon.textContent = isShowingMore
      ? "keyboard_arrow_up"
      : "keyboard_arrow_down";
    updateLetterDensity();
  };

  // Supprimer les espaces
  const removeSpaces = () => {
    textarea.value = textarea.value.replace(/\s+/g, "");
  };

  // Appliquer la limite de caractères
  const limitCharacters = () => {
    if (textarea.value.length > 300) {
      textarea.value = textarea.value.slice(0, 300);
    }
  };

  // Gestion des événements
  excludeSpacesButton.addEventListener("click", () => {
    excludeSpacesActive = !excludeSpacesActive;
    excludeSpacesButton.classList.toggle("checked");

    if (excludeSpacesActive) {
      originalText = textarea.value;
      removeSpaces();
      excludeSpacesButton.innerHTML = `<span class="text-[#12131a] material-symbols-rounded text-sx">check</span>`;
    } else {
      textarea.value = originalText;
      excludeSpacesButton.innerHTML = "";
    }

    updateCharStats();
    updateLetterDensity();
  });

  setLimitButton.addEventListener("click", () => {
    setLimitActive = !setLimitActive;
    setLimitButton.classList.toggle("checked");

    if (setLimitActive) {
      originalText = textarea.value;
      limitCharacters();
      setLimitButton.innerHTML = `<span class="text-[#12131a] material-symbols-rounded text-sx">check</span>`;
    } else {
      textarea.value = originalText;
      setLimitButton.innerHTML = "";
    }

    updateCharStats();
    updateLetterDensity();
  });

  textarea.addEventListener("input", () => {
    if (excludeSpacesActive) removeSpaces();
    if (setLimitActive) limitCharacters();
    updateCharStats();
    updateLetterDensity();
  });

  // Initialisation
  btnToggleTheme.addEventListener("click", toggleTheme);
  showMoreOrLessButton.addEventListener("click", toggleShowMoreOrLess);
  updateCharStats();
  updateLetterDensity();
});
