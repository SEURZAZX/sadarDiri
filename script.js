document.addEventListener("DOMContentLoaded", () => {
  // --- Elemen Global ---
  const usernameInput = document.getElementById("usernameInput");
  const startButton = document.getElementById("startButton");
  const userDisplay = document.getElementById("userDisplay");
  const currentUsernameSpan = document.getElementById("currentUsername");
  const mainNav = document.getElementById("mainNav");
  const navButtons = document.querySelectorAll(".nav-button");
  const sections = document.querySelectorAll(".section-card");
  const loginSection = document.getElementById("loginSection");

  // --- Elemen Tes Kondisi Mental ---
  const mentalTestSection = document.getElementById("mental-test");
  const mentalTestConversationArea = document.getElementById(
    "mentalTestConversation"
  );
  const mentalTestOptions = document.getElementById("mentalTestOptions");
  const mentalTestNextButton = document.getElementById("mentalTestNextButton");
  const startMentalTestButton = document.getElementById("startMentalTest");
  const mentalTestResultDisplay = document.getElementById("mentalTestResult");
  const resetMentalTestButton = document.getElementById("resetMentalTest");

  // --- Elemen Mengatasi Insecure ---
  const insecureGuideSection = document.getElementById("insecure-guide");
  const insecureGuideConversationArea = document.getElementById(
    "insecureGuideConversation"
  );
  const insecureGuideNextButton = document.getElementById(
    "insecureGuideNextButton"
  );
  const startInsecureGuideButton =
    document.getElementById("startInsecureGuide");

  // --- Elemen Membangun Kepercayaan Diri ---
  const confidenceBoostSection = document.getElementById("confidence-boost");
  const confidenceBoostConversationArea = document.getElementById(
    "confidenceBoostConversation"
  );
  const confidenceBoostNextButton = document.getElementById(
    "confidenceBoostNextButton"
  );
  const startConfidenceBoostButton = document.getElementById(
    "startConfidenceBoost"
  );

  // --- Variabel Game/Aplikasi ---
  let currentUser = ""; // Ini akan diisi dari localStorage atau input
  let currentActiveSectionId = "loginSection";
  let typingTimer = null;

  // Variabel Tes Mental
  let mentalTestQuestions = [];
  let currentQuestionIndex = 0;
  let mentalTestScore = 0;
  let isTestRunning = false;

  // Variabel Panduan Insecure & Confidence
  let insecureGuideSteps = [];
  let currentInsecureStepIndex = 0;
  let isInsecureGuideRunning = false;

  let confidenceBoostSteps = [];
  let currentConfidenceStepIndex = 0;
  let isConfidenceBoostRunning = false;

  // --- Konten Percakapan/Panduan ---

  const generalGreetings = [
    {
      speaker: "System",
      text: "Halo, [username]! Selamat datang di Inner Compass. Aku di sini untuk membantumu menjelajahi potensi diri.",
    },
    {
      speaker: "System",
      text: "Kita akan melakukan perjalanan singkat untuk memahami dirimu lebih baik.",
    },
  ];

  const mentalTestContent = [
    {
      type: "question",
      question:
        "Bagaimana perasaanmu secara umum dalam beberapa hari terakhir?",
      options: [
        { text: "Sangat baik, penuh energi dan positif.", score: 3 },
        { text: "Cukup baik, ada naik turunnya tapi bisa diatasi.", score: 2 },
        { text: "Biasa saja, tidak ada yang istimewa.", score: 1 },
        { text: "Sedikit murung atau cemas.", score: 0 },
        { text: "Sangat buruk, merasa kewalahan dan sulit.", score: 0 },
      ],
    },
    {
      type: "question",
      question: "Ketika menghadapi tantangan, apa reaksi pertamamu?",
      options: [
        { text: "Langsung mencari solusi dan bertindak.", score: 3 },
        { text: "Menganalisis situasi lalu menyusun rencana.", score: 2 },
        { text: "Sedikit cemas, tapi tetap mencoba.", score: 1 },
        { text: "Merasa ragu dan cenderung menunda.", score: 0 },
        { text: "Panik dan ingin menyerah.", score: 0 },
      ],
    },
    {
      type: "question",
      question:
        "Seberapa sering kamu membandingkan dirimu dengan orang lain di media sosial atau kehidupan nyata?",
      options: [
        { text: "Hampir tidak pernah.", score: 3 },
        { text: "Kadang-kadang, tapi tidak sampai mengganggu.", score: 2 },
        { text: "Cukup sering, dan kadang merasa kurang.", score: 1 },
        {
          text: "Sangat sering, dan sering merasa tidak cukup baik.",
          score: 0,
        },
      ],
    },
    {
      type: "question",
      question: "Bagaimana kamu menerima kritik atau masukan dari orang lain?",
      options: [
        {
          text: "Menerimanya sebagai kesempatan untuk belajar dan tumbuh.",
          score: 3,
        },
        {
          text: "Mendengarkan dengan terbuka, lalu mempertimbangkannya.",
          score: 2,
        },
        {
          text: "Sedikit tersinggung, tapi berusaha mengambil hikmahnya.",
          score: 1,
        },
        { text: "Merasa diserang dan cenderung membela diri.", score: 0 },
      ],
    },
    {
      type: "result", // Tipe 'result' untuk menampilkan hasil tes
      message: (score) => {
        if (score >= 12) {
          return `Luar biasa, [username]! Skor mentalmu ${score}. Kamu memiliki ketahanan mental yang sangat baik dan pandangan hidup yang positif. Terus pertahankan!`;
        } else if (score >= 8) {
          return `Cukup baik, [username]! Skor mentalmu ${score}. Kamu punya dasar mental yang kuat, tapi ada area di mana kamu bisa tumbuh. Terus berlatih dan jaga dirimu!`;
        } else if (score >= 4) {
          return `[username], skor mentalmu ${score}. Kamu mungkin sedang menghadapi beberapa tantangan. Ingat, tidak apa-apa untuk merasa seperti itu. Fokus pada langkah kecil untuk perbaikan. Kamu tidak sendiri!`;
        } else {
          return `[username], skor mentalmu ${score}. Kamu mungkin sedang berada di titik yang sulit. Penting untuk mencari dukungan dan beristirahat. Ingat, kamu kuat dan ini akan berlalu. Kami mendukungmu!`;
        }
      },
    },
  ];

  const insecureGuideContent = [
    {
      speaker: "System",
      text: "Setiap orang pernah merasa *insecure*, [username]. Itu bagian dari menjadi manusia. Yang penting adalah bagaimana kita menghadapinya.",
    },
    {
      speaker: "System",
      text: "Mari kita mulai dengan memahami bahwa *insecure* seringkali berasal dari perbandingan. Ingat, rumput tetangga selalu terlihat lebih hijau karena kita melihatnya dari kejauhan. Fokus pada keunikanmu!",
    },
    {
      speaker: "System",
      text: 'Latihan 1: Catat tiga hal yang kamu sukai dari dirimu sendiri hari ini. Tidak perlu hal besar, hal kecil pun tak masalah. (Misal: "Aku suka caraku menata rambut", "Aku suka caraku tersenyum", "Aku bangga sudah menyelesaikan tugasku"). Lakukan ini setiap hari!',
    },
    {
      speaker: "System",
      text: 'Latihan 2: Ubah pikiran negatif menjadi positif. Setiap kali ada pikiran "Aku tidak bisa", ubah menjadi "Aku sedang dalam proses belajar dan aku akan terus berkembang". Ini butuh latihan, tapi akan membuahkan hasil.',
    },
    {
      speaker: "System",
      text: "Ingatlah, [username]: Kamu unik, kamu berharga, dan kamu memiliki kekuatan yang mungkin belum kamu sadari. Jangan biarkan bayangan orang lain menutupi sinarmu. Kamu pantas bahagia!",
    },
  ];

  const confidenceBoostContent = [
    {
      speaker: "System",
      text: "Kepercayaan diri bukanlah tentang menjadi sempurna, [username]. Tapi tentang menerima dirimu apa adanya dan percaya pada kemampuanmu.",
    },
    {
      speaker: "System",
      text: 'Langkah 1: Tetapkan tujuan kecil yang bisa kamu capai setiap hari atau setiap minggu. Contoh: "Hari ini aku akan membereskan mejaku", "Aku akan membantu seseorang", atau "Aku akan mencoba hobi baru". Setiap pencapaian kecil membangun kepercayaan diri yang kokoh.',
    },
    {
      speaker: "System",
      text: 'Langkah 2: Gunakan afirmasi positif. Ucapkan kalimat seperti "Aku kompeten", "Aku layak dicintai", "Aku mampu mengatasi tantangan", dan "Aku percaya pada diriku" setiap pagi di depan cermin. Rasakan setiap kata itu!',
    },
    {
      speaker: "System",
      text: "Langkah 3: Jaga penampilan dan postur tubuh. Berdiri tegak, senyum, lakukan kontak mata saat berbicara, dan berpakaian rapi. Bahasa tubuhmu sangat memengaruhi perasaanmu dan bagaimana orang lain memandangmu.",
    },
    {
      speaker: "System",
      text: "Langkah 4: Kelilingi dirimu dengan orang-orang yang mendukung dan positif. Jauhi lingkungan atau orang yang membuatmu merasa kecil. Lingkungan yang sehat akan memupuk kepercayaan dirimu.",
    },
    {
      speaker: "System",
      text: "Teruslah melangkah, [username]! Kepercayaan dirimu akan bersinar dan membuka banyak pintu kesempatan. Kamu luar biasa, jangan pernah ragu akan itu!",
    },
  ];

  // --- Fungsi Utilitas ---

  // Fungsi untuk menampilkan satu section dan menyembunyikan yang lain
  function showSection(sectionId) {
    // Hentikan semua animasi ketik yang mungkin sedang berjalan di section lain
    clearTimeout(typingTimer);
    // Reset status panduan yang mungkin aktif
    isTestRunning = false;
    isInsecureGuideRunning = false;
    isConfidenceBoostRunning = false;

    sections.forEach((section) => {
      if (section.id === sectionId) {
        // Untuk section yang akan aktif
        section.classList.remove("hidden");
        setTimeout(() => {
          section.classList.add("active");
          // Scroll ke atas saat section baru aktif jika kontennya panjang
          section.scrollTop = 0;
        }, 10);
      } else {
        // Untuk section yang akan disembunyikan
        section.classList.remove("active");
        // Beri sedikit waktu untuk animasi fade out sebelum hidden
        setTimeout(() => {
          section.classList.add("hidden");
        }, 600); // Sesuai dengan durasi transisi CSS
      }
    });

    // Update status active pada nav buttons (jika bukan loginSection)
    if (sectionId !== "loginSection") {
      if (mainNav && userDisplay) {
        // Pastikan elemen ada
        navButtons.forEach((button) => {
          if (button.dataset.section === sectionId) {
            button.classList.add("active");
          } else {
            button.classList.remove("active");
          }
        });
        mainNav.classList.remove("hidden");
        userDisplay.classList.remove("hidden");
      }
    } else {
      // Sembunyikan nav dan user display jika di loginSection
      if (mainNav && userDisplay) {
        // Pastikan elemen ada
        mainNav.classList.add("hidden");
        userDisplay.classList.add("hidden");
      }
    }
    currentActiveSectionId = sectionId; // Update ID section aktif
  }

  // Fungsi untuk mengetik teks baris demi baris di area percakapan
  async function typeDialogue(areaElement, speaker, text) {
    clearTimeout(typingTimer);

    const lineDiv = document.createElement("div");
    lineDiv.classList.add("dialogue-line");
    if (speaker === "Anda") {
      lineDiv.classList.add("user-response");
    }

    const speakerSpan = document.createElement("span");
    speakerSpan.classList.add("speaker");
    speakerSpan.textContent = `${speaker}: `;
    lineDiv.appendChild(speakerSpan);

    const textSpan = document.createElement("span");
    lineDiv.appendChild(textSpan);

    areaElement.appendChild(lineDiv);
    areaElement.scrollTop = areaElement.scrollHeight; // Scroll ke bawah

    let i = 0;
    const typingSpeed = 25;

    return new Promise((resolve) => {
      function typeChar() {
        if (i < text.length) {
          textSpan.textContent += text.charAt(i);
          i++;
          typingTimer = setTimeout(typeChar, typingSpeed);
        } else {
          resolve();
        }
      }
      typeChar();
    });
  }

  // --- Logika Login ---
  if (startButton && usernameInput && loginSection && currentUsernameSpan) {
    // Pastikan semua elemen ada
    startButton.addEventListener("click", () => {
      currentUser = usernameInput.value.trim();
      if (currentUser) {
        localStorage.setItem("loggedInUsername", currentUser); // Simpan nama
        currentUsernameSpan.textContent = currentUser;
        showSection("mental-test"); // Langsung ke Tes Mental setelah login
        resetMentalTestState(); // Pastikan tes siap dimulai
      } else {
        alert("Nama tidak boleh kosong!");
        usernameInput.focus();
      }
    });

    usernameInput.addEventListener("keypress", (e) => {
      if (e.key === "Enter") {
        startButton.click();
      }
    });
  }

  // --- Logika Navigasi ---
  navButtons.forEach((button) => {
    button.addEventListener("click", () => {
      const sectionId = button.dataset.section;
      if (sectionId && sectionId !== currentActiveSectionId) {
        // Gunakan currentActiveSectionId
        showSection(sectionId);
        // Reset/persiapkan ulang konten setiap bagian saat beralih
        if (sectionId === "mental-test") {
          // Cek jika tes belum dimulai atau sudah selesai, baru reset state
          // Jika isTestRunning true tapi belum di reset result, maka jangan reset state.
          if (
            !isTestRunning ||
            mentalTestResultDisplay.classList.contains("active")
          ) {
            resetMentalTestState();
          }
        } else if (sectionId === "insecure-guide") {
          resetInsecureGuideState();
        } else if (sectionId === "confidence-boost") {
          resetConfidenceBoostState();
        }
      }
    });
  });

  // --- Logika Tes Kondisi Mental ---
  function resetMentalTestState() {
    isTestRunning = false;
    currentQuestionIndex = 0;
    mentalTestScore = 0;
    mentalTestConversationArea.innerHTML = "";
    mentalTestOptions.innerHTML = "";
    mentalTestOptions.classList.add("hidden");
    mentalTestNextButton.classList.add("hidden");
    mentalTestResultDisplay.classList.add("hidden"); // Sembunyikan hasil
    mentalTestResultDisplay.classList.remove("active"); // Pastikan tidak active
    resetMentalTestButton.classList.add("hidden");
    startMentalTestButton.classList.remove("hidden");
    mentalTestConversationArea.scrollTop = 0; // Reset scroll
  }

  if (mentalTestSection) {
    startMentalTestButton.addEventListener("click", () => {
      isTestRunning = true;
      startMentalTestButton.classList.add("hidden");
      mentalTestNextButton.classList.add("hidden"); // Sembunyikan tombol next diawal
      mentalTestScore = 0;
      currentQuestionIndex = 0;
      mentalTestConversationArea.innerHTML = "";
      mentalTestOptions.innerHTML = "";
      mentalTestResultDisplay.classList.add("hidden");
      resetMentalTestButton.classList.add("hidden");

      // Mulai dengan salam umum
      let greetingIndex = 0;
      async function playGreetings() {
        if (greetingIndex < generalGreetings.length) {
          await typeDialogue(
            mentalTestConversationArea,
            generalGreetings[greetingIndex].speaker,
            generalGreetings[greetingIndex].text.replace(
              "[username]",
              currentUser
            )
          );
          greetingIndex++;
          // Delay sedikit sebelum baris berikutnya jika perlu
          // await new Promise(resolve => setTimeout(resolve, 500));
          playGreetings();
        } else {
          // Setelah salam selesai, tampilkan pertanyaan pertama
          displayNextMentalQuestion();
        }
      }
      playGreetings();
    });

    mentalTestNextButton.addEventListener("click", () => {
      displayNextMentalQuestion();
    });

    resetMentalTestButton.addEventListener("click", () => {
      resetMentalTestState();
    });

    async function displayNextMentalQuestion() {
      mentalTestOptions.classList.add("hidden");
      mentalTestOptions.innerHTML = "";
      mentalTestNextButton.classList.add("hidden");

      if (currentQuestionIndex < mentalTestContent.length) {
        const item = mentalTestContent[currentQuestionIndex];

        if (item.type === "question") {
          await typeDialogue(
            mentalTestConversationArea,
            "System",
            item.question
          );
          renderMentalTestOptions(item.options);
        } else if (item.type === "result") {
          mentalTestNextButton.classList.add("hidden");
          resetMentalTestButton.classList.remove("hidden");

          const resultText = item
            .message(mentalTestScore)
            .replace("[username]", currentUser);
          await typeDialogue(mentalTestConversationArea, "System", resultText);
          mentalTestResultDisplay.textContent = resultText;
          mentalTestResultDisplay.classList.remove("hidden");
          isTestRunning = false; // Tes selesai
        }
        currentQuestionIndex++;
      } else {
        // Fallback jika array content berakhir tanpa tipe 'result'
        mentalTestNextButton.classList.add("hidden");
        resetMentalTestButton.classList.remove("hidden");
        await typeDialogue(
          mentalTestConversationArea,
          "System",
          "Tes selesai. Silakan ulangi tes."
        );
        isTestRunning = false;
      }
      mentalTestConversationArea.scrollTop =
        mentalTestConversationArea.scrollHeight;
    }

    function renderMentalTestOptions(options) {
      mentalTestOptions.innerHTML = "";
      options.forEach((option) => {
        const button = document.createElement("button");
        button.classList.add("option-button");
        button.textContent = option.text;
        button.dataset.score = String(option.score);
        button.addEventListener("click", () => {
          // Nonaktifkan semua tombol setelah memilih
          mentalTestOptions
            .querySelectorAll(".option-button")
            .forEach((btn) => {
              btn.classList.remove("selected");
              btn.disabled = true; // Nonaktifkan semua tombol setelah memilih
            });
          button.classList.add("selected");
          mentalTestScore += option.score;
          typeDialogue(mentalTestConversationArea, "Anda", option.text).then(
            () => {
              mentalTestOptions
                .querySelectorAll(".option-button")
                .forEach((btn) => {
                  btn.disabled = false; // Aktifkan kembali untuk pertanyaan berikutnya
                });
              mentalTestNextButton.classList.remove("hidden"); // Tampilkan tombol next
            }
          );
        });
        mentalTestOptions.appendChild(button);
      });
      mentalTestOptions.classList.remove("hidden");
    }
  }

  // --- Logika Mengatasi Insecure ---
  function resetInsecureGuideState() {
    isInsecureGuideRunning = false;
    currentInsecureStepIndex = 0;
    insecureGuideConversationArea.innerHTML = "";
    insecureGuideNextButton.classList.add("hidden");
    startInsecureGuideButton.classList.remove("hidden");
    insecureGuideConversationArea.scrollTop = 0; // Reset scroll
  }

  if (insecureGuideSection) {
    startInsecureGuideButton.addEventListener("click", () => {
      isInsecureGuideRunning = true;
      startInsecureGuideButton.classList.add("hidden");
      insecureGuideNextButton.classList.remove("hidden");
      insecureGuideConversationArea.innerHTML = "";
      currentInsecureStepIndex = 0;
      insecureGuideSteps = [...generalGreetings, ...insecureGuideContent];
      displayNextInsecureStep();
    });

    insecureGuideNextButton.addEventListener("click", () => {
      displayNextInsecureStep();
    });

    async function displayNextInsecureStep() {
      if (currentInsecureStepIndex < insecureGuideSteps.length) {
        const item = insecureGuideSteps[currentInsecureStepIndex];
        await typeDialogue(
          insecureGuideConversationArea,
          item.speaker,
          item.text.replace("[username]", currentUser)
        );
        currentInsecureStepIndex++;
      } else {
        // Akhir dari panduan
        await typeDialogue(
          insecureGuideConversationArea,
          "System",
          "Itulah beberapa langkah untuk mengatasi *insecure*. Ingat, perjalanan ini butuh waktu dan kesabaran. Kamu pasti bisa, [username]!".replace(
            "[username]",
            currentUser
          )
        );
        insecureGuideNextButton.classList.add("hidden");
        isInsecureGuideRunning = false; // Panduan selesai
      }
      insecureGuideConversationArea.scrollTop =
        insecureGuideConversationArea.scrollHeight;
    }
  }

  // --- Logika Membangun Kepercayaan Diri ---
  function resetConfidenceBoostState() {
    isConfidenceBoostRunning = false;
    currentConfidenceStepIndex = 0;
    confidenceBoostConversationArea.innerHTML = "";
    confidenceBoostNextButton.classList.add("hidden");
    startConfidenceBoostButton.classList.remove("hidden");
    confidenceBoostConversationArea.scrollTop = 0; // Reset scroll
  }

  if (confidenceBoostSection) {
    startConfidenceBoostButton.addEventListener("click", () => {
      isConfidenceBoostRunning = true;
      startConfidenceBoostButton.classList.add("hidden");
      confidenceBoostNextButton.classList.remove("hidden");
      confidenceBoostConversationArea.innerHTML = "";
      currentConfidenceStepIndex = 0;
      confidenceBoostSteps = [...generalGreetings, ...confidenceBoostContent];
      displayNextConfidenceStep();
    });

    confidenceBoostNextButton.addEventListener("click", () => {
      displayNextConfidenceStep();
    });

    async function displayNextConfidenceStep() {
      if (currentConfidenceStepIndex < confidenceBoostSteps.length) {
        const item = confidenceBoostSteps[currentConfidenceStepIndex];
        await typeDialogue(
          confidenceBoostConversationArea,
          item.speaker,
          item.text.replace("[username]", currentUser)
        );
        currentConfidenceStepIndex++;
      } else {
        // Akhir dari panduan
        await typeDialogue(
          confidenceBoostConversationArea,
          "System",
          "Teruslah melangkah, [username]! Kepercayaan dirimu akan bersinar. Kamu luar biasa!".replace(
            "[username]",
            currentUser
          )
        );
        confidenceBoostNextButton.classList.add("hidden");
        isConfidenceBoostRunning = false; // Panduan selesai
      }
      confidenceBoostConversationArea.scrollTop =
        confidenceBoostConversationArea.scrollHeight;
    }
  }

  // --- Inisialisasi Aplikasi Saat DOM Selesai Dimuat ---
  const storedUsername = localStorage.getItem("loggedInUsername");
  if (storedUsername) {
    currentUser = storedUsername;
    if (currentUsernameSpan) {
      currentUsernameSpan.textContent = currentUser;
    }

    // Atur tampilan awal setelah login
    // Semua section dimulai dengan hidden, lalu showSection akan mengaktifkan yang benar
    sections.forEach((section) => {
      section.classList.add("hidden");
      section.classList.remove("active");
    });

    // Tampilkan elemen header dan navigasi
    mainNav.classList.remove("hidden");
    userDisplay.classList.remove("hidden");

    showSection("mental-test"); // Tampilkan Tes Mental sebagai default setelah login
    resetMentalTestState(); // Pastikan state tes mental direset dan siap dimulai
  } else {
    // Jika belum login, pastikan hanya loginSection yang aktif
    sections.forEach((section) => {
      section.classList.remove("active"); // Pastikan semua tidak aktif
      section.classList.add("hidden"); // Dan sembunyikan semua
    });

    // Kemudian, aktifkan hanya loginSection
    if (loginSection) {
      loginSection.classList.remove("hidden");
      loginSection.classList.add("active");
    }

    // Pastikan nav dan user display tersembunyi juga
    mainNav.classList.add("hidden");
    userDisplay.classList.add("hidden");
    currentActiveSectionId = "loginSection"; // Set state aktif

    // Kosongkan dan fokuskan input username
    if (usernameInput) {
      usernameInput.value = "";
      usernameInput.focus();
    }
  }
});
