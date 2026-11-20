// ============================================================
// AIHER SCIENCE CAREER DISCOVERY TEST
// 20 questions: 3 Physics, 3 Chemistry, 3 Mathematics,
// 3 Biology and 8 Career Interest questions.
// ============================================================

const GOOGLE_SCRIPT_URL =
  "https://script.google.com/macros/s/AKfycbxBE6Fzgkhu_4uCxtty7xLUThh_tYGzxu59TFyKO44ZoLph0la4JeN5-LAr-JKCudYeAg/exec";

const questions = [
  // PHYSICS: Easy, Medium, Hard
  { section: "Physics", difficulty: "Easy", q: "What is the SI unit of force?", o: ["Joule", "Newton", "Watt", "Pascal"], a: 1 },
  { section: "Physics", difficulty: "Medium", q: "A car travels 120 metres in 10 seconds. What is its average speed?", o: ["10 m/s", "12 m/s", "15 m/s", "20 m/s"], a: 1 },
  { section: "Physics", difficulty: "Hard", q: "A 2 kg object accelerates at 3 m/s². What is the net force acting on it?", o: ["3 N", "5 N", "6 N", "9 N"], a: 2 },

  // CHEMISTRY: Easy, Medium, Hard
  { section: "Chemistry", difficulty: "Easy", q: "What is the chemical symbol for sodium?", o: ["So", "S", "Na", "N"], a: 2 },
  { section: "Chemistry", difficulty: "Medium", q: "A solution with a pH of 3 is:", o: ["Acidic", "Neutral", "Alkaline", "Always pure water"], a: 0 },
  { section: "Chemistry", difficulty: "Hard", q: "How many moles are present in 18 grams of water (H₂O)? (Molar mass = 18 g/mol)", o: ["0.5 mol", "1 mol", "2 mol", "18 mol"], a: 1 },

  // MATHEMATICS: Easy, Medium, Hard
  { section: "Mathematics", difficulty: "Easy", q: "What is 25 × 4?", o: ["80", "90", "100", "120"], a: 2 },
  { section: "Mathematics", difficulty: "Medium", q: "Solve: 2x + 5 = 17. What is x?", o: ["5", "6", "7", "8"], a: 1 },
  { section: "Mathematics", difficulty: "Hard", q: "What is the derivative of x² with respect to x?", o: ["x", "2x", "x³", "2"], a: 1 },

  // BIOLOGY: Easy, Medium, Hard
  { section: "Biology", difficulty: "Easy", q: "Which cell organelle is known as the powerhouse of the cell?", o: ["Nucleus", "Ribosome", "Mitochondrion", "Golgi apparatus"], a: 2 },
  { section: "Biology", difficulty: "Medium", q: "Which part of the kidney filters blood to form urine?", o: ["Alveolus", "Nephron", "Neuron", "Villus"], a: 1 },
  { section: "Biology", difficulty: "Hard", q: "In DNA, adenine pairs with which nitrogenous base?", o: ["Guanine", "Cytosine", "Thymine", "Uracil"], a: 2 },

  // CAREER INTEREST: no right or wrong answers
  { section: "Career Interest", q: "Which activity would you most enjoy?", o: ["Caring for patients", "Conducting scientific research", "Building technology or software", "Leading a team or organisation"], interest: true, tags: ["healthcare", "research", "technology", "business"] },
  { section: "Career Interest", q: "Which work environment appeals to you most?", o: ["Hospital or healthcare centre", "Research or diagnostic laboratory", "Technology company", "Office or business organisation"], interest: true, tags: ["healthcare", "research", "technology", "business"] },
  { section: "Career Interest", q: "Which task sounds most interesting?", o: ["Helping someone recover mobility", "Testing medicines or samples", "Designing an app or device", "Planning a project or event"], interest: true, tags: ["rehabilitation", "research", "technology", "business"] },
  { section: "Career Interest", q: "What kind of problem would you like to solve?", o: ["A patient's health concern", "A scientific question", "A technical or engineering challenge", "A business or management challenge"], interest: true, tags: ["healthcare", "research", "technology", "business"] },
  { section: "Career Interest", q: "Which subject area would you like to explore further?", o: ["Human health and anatomy", "Biotechnology and medicines", "Computers and mathematics", "Economics and management"], interest: true, tags: ["healthcare", "research", "technology", "business"] },
  { section: "Career Interest", q: "Which contribution would make you feel most fulfilled?", o: ["Improving people's health and wellbeing", "Discovering new knowledge", "Creating useful technology", "Building and managing an organisation"], interest: true, tags: ["healthcare", "research", "technology", "business"] },
  { section: "Career Interest", q: "Which skill would you most like to use every day?", o: ["Communication and patient support", "Observation and experimentation", "Logical thinking and coding", "Leadership and decision-making"], interest: true, tags: ["healthcare", "research", "technology", "business"] },
  { section: "Career Interest", q: "Which future role would you like to learn more about?", o: ["Doctor, nurse or allied-health professional", "Scientist or pharmacist", "Software developer or technology professional", "Entrepreneur or manager"], interest: true, tags: ["healthcare", "research", "technology", "business"] }
];

const subjectSections = ["Physics", "Chemistry", "Mathematics", "Biology"];
const sectionCounts = { Physics: 3, Chemistry: 3, Mathematics: 3, Biology: 3 };
const careerNames = {
  healthcare: "Healthcare and Allied Health",
  rehabilitation: "Physiotherapy and Rehabilitation",
  research: "Research, Biotechnology and Pharmaceutical Sciences",
  technology: "Computing, Technology and Engineering",
  business: "Business, Management and Entrepreneurship"
};

let current = 0;
let answers = Array(questions.length).fill(null);
let finalReport = null;

const $ = (id) => document.getElementById(id);

function continueToTest() {
  $("formPage").classList.remove("active");
  $("formPage").classList.add("hidden");
  $("testPage").classList.remove("hidden");
  $("studentPanel").classList.add("page-enter");
  window.scrollTo({ top: 0, behavior: "smooth" });
}

$("contactNumber").addEventListener("input", function () {
  this.value = this.value.replace(/[^0-9]/g, "").slice(0, 10);
});

function generateStudentId() {
  const now = new Date();
  const datePart = `${now.getFullYear()}${String(now.getMonth() + 1).padStart(2, "0")}${String(now.getDate()).padStart(2, "0")}`;
  const randomPart = window.crypto?.getRandomValues
    ? Array.from(window.crypto.getRandomValues(new Uint32Array(1)))[0].toString(36).toUpperCase().slice(0, 7)
    : Math.random().toString(36).substring(2, 9).toUpperCase();
  return `AIHER-${datePart}-${randomPart}`;
}

function beginQuiz() {
  const name = $("studentName").value.trim();
  const phone = $("contactNumber").value.trim();
  const email = $("studentEmail").value.trim();
  const cityname = $("cityName").value.trim();
  const schoolname = $("schoolName").value.trim();

  if (!name) return alert("Please enter the student's name."), $("studentName").focus();
  if (!/^[0-9]{10}$/.test(phone)) return alert("Please enter a valid 10-digit contact number."), $("contactNumber").focus();
  if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return alert("Please enter a valid email address."), $("studentEmail").focus();
  if (!$("subjectCombo").value) return alert("Please select the subject combination."), $("subjectCombo").focus();
  if (!$("studentClass").value) return alert("Please select the student's class."), $("studentClass").focus();
  if (!$("cityName").value) return alert("Please select the student's class."), $("cityName").focus();
  if (!$("schoolName").value) return alert("Please select the student's class."), $("schoolName").focus();

  $("studentPanel").classList.add("hidden");
  $("quizPanel").classList.remove("hidden");
  $("quizPanel").classList.add("page-enter");
  current = 0;
  renderQuestion();
  window.scrollTo({ top: 0, behavior: "smooth" });
}

function renderQuestion() {
  const question = questions[current];
  const area = $("questionArea");
  const sectionIndex = ["Physics", "Chemistry", "Mathematics", "Biology", "Career Interest"].indexOf(question.section);

  $("progressText").textContent = `Question ${current + 1} of ${questions.length} · ${question.section}`;
  $("bar").style.width = `${((current + 1) / questions.length) * 100}%`;
  document.querySelectorAll(".section-pill").forEach((pill, index) => {
    pill.classList.toggle("active", index === sectionIndex);
    pill.classList.toggle("completed", index < sectionIndex);
  });

  const difficulty = question.difficulty
    ? `<span class="difficulty ${question.difficulty.toLowerCase()}">${question.difficulty} Level</span>`
    : `<span class="difficulty interest-level">Preference Question</span>`;

  area.innerHTML = `
    <article class="question-card">
      <div class="question-meta"><span>${escapeHTML(question.section)}</span>${difficulty}</div>
      <h3 class="qtitle">${current + 1}. ${escapeHTML(question.q)}</h3>
      <div class="options">
        ${question.o.map((option, index) => `
          <label class="option ${answers[current] === index ? "selected" : ""}">
            <input type="radio" name="answer" value="${index}" ${answers[current] === index ? "checked" : ""}>
            <span class="option-letter">${String.fromCharCode(65 + index)}</span>
            <span class="option-text">${escapeHTML(option)}</span>
          </label>
        `).join("")}
      </div>
    </article>`;

  area.querySelectorAll('input[name="answer"]').forEach(input => {
    input.addEventListener("change", event => {
      answers[current] = Number(event.target.value);
      renderQuestion();
    });
  });

  $("prevBtn").disabled = current === 0;
  $("nextBtn").classList.toggle("hidden", current === questions.length - 1);
  $("submitBtn").classList.toggle("hidden", current !== questions.length - 1);
}

function escapeHTML(value) {
  return String(value).replace(/[&<>"']/g, char => ({
    "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;"
  })[char]);
}

function move(delta) {
  if (answers[current] === null) {
    alert("Please select an answer before continuing.");
    return;
  }
  current = Math.max(0, Math.min(questions.length - 1, current + delta));
  renderQuestion();
  $("questionArea").scrollIntoView({ behavior: "smooth", block: "start" });
}

function createReport() {
  const student = {
    studentName: $("studentName").value.trim(),
    contactNumber: $("contactNumber").value.trim(),
    email: $("studentEmail").value.trim(),
    subjectCombo: $("subjectCombo").value,
    studentClass: $("studentClass").value,
    cityName: $("cityName").value,
    schoolName: $("schoolName").value,
  };
  const studentId = generateStudentId();
  const earned = {};
  subjectSections.forEach(section => earned[section] = 0);

  questions.forEach((question, index) => {
    if (!question.interest && answers[index] === question.a) earned[question.section]++;
  });

  const total = Object.values(earned).reduce((sum, score) => sum + score, 0);
  const maximumScore = 12;
  const percentage = (total / maximumScore) * 100;

  const sectionReport = subjectSections.map(section => ({
    section,
    score: earned[section],
    maximum: sectionCounts[section],
    percentage: earned[section] / sectionCounts[section] * 100
  }));

  const interestCounts = {};
  Object.keys(careerNames).forEach(key => interestCounts[key] = 0);
  questions.forEach((question, index) => {
    if (question.interest) {
      const tag = question.tags[answers[index]];
      interestCounts[tag] = (interestCounts[tag] || 0) + 1;
    }
  });

  const rankedInterests = Object.entries(interestCounts).sort((a, b) => b[1] - a[1]);
  const topInterests = rankedInterests.filter(item => item[1] > 0).slice(0, 3);
  const interestText = topInterests.length
    ? topInterests.map(([key, count]) => `${careerNames[key]} (${count})`).join(" · ")
    : "No clear preference identified";
  const pathways = buildPathways(topInterests);

  const answerReport = questions.map((question, index) => ({
    questionNumber: index + 1,
    section: question.section,
    difficulty: question.difficulty || "Interest",
    question: question.q,
    selectedAnswer: question.o[answers[index]],
    correctAnswer: question.interest ? "Not applicable" : question.o[question.a],
    result: question.interest ? "Not scored" : (answers[index] === question.a ? "Correct" : "Incorrect")
  }));

  return {
    ...student, studentId, totalScore: total, maximumScore,
    percentage: Number(percentage.toFixed(1)), sectionReport,
    interestText, topInterests: topInterests.map(([key]) => careerNames[key]),
    pathways, answerReport, submittedAt: new Date().toISOString(),
    reportText: [
      `AIHER SCIENCE CAREER DISCOVERY REPORT`,
      `Student ID: ${studentId}`,
      `Student Name: ${student.studentName}`,
      `Contact Number: ${student.contactNumber}`,
      `Email: ${student.email || "Not provided"}`,
      `Class: ${student.studentClass}`,
      `Subject Combination: ${student.subjectCombo}`,
      `City: ${student.cityName}`,
      `School: ${student.schoolName}`,
      `TOTAL SCORE: ${total}/${maximumScore} (${percentage.toFixed(1)}%)`,
      `SECTION-WISE PERFORMANCE: ${sectionReport.map(item => `${item.section}: ${item.score}/${item.maximum}`).join("; ")}`,
      `CAREER INTERESTS: ${interestText}`,
      `PATHWAYS: ${pathways.map(item => item.name).join("; ")}`
    ].join("\n")
  };
}

function buildPathways(topInterests) {
  const descriptions = {
    healthcare: ["Healthcare and Allied Health", "Explore programmes such as Nursing and relevant allied-health courses, and compare their clinical responsibilities and eligibility."],
    rehabilitation: ["Physiotherapy and Rehabilitation", "Explore BPT and rehabilitation-focused careers involving movement, recovery and patient support."],
    research: ["Research, Biotechnology and Pharmaceutical Sciences", "Explore B.Pharm, Pharm.D, biotechnology and laboratory-based study pathways."],
    technology: ["Computing, Technology and Engineering", "Explore computing, information technology and engineering pathways that involve analytical and technical problem-solving."],
    business: ["Business, Management and Entrepreneurship", "Explore management, business administration and entrepreneurship pathways."]
  };
  const keys = topInterests.map(([key]) => key);
  if (!keys.length) return [{ name: "Explore with a Counsellor", description: "Your responses show a developing preference profile. A counsellor can help you compare subjects, course content and work environments." }];
  return keys.map(key => ({ name: descriptions[key][0], description: descriptions[key][1] }));
}

function displayReport(report) {
  $("studentSummary").textContent = `Student: ${report.studentName} | Class: ${report.studentClass} | Subject Combination: ${report.subjectCombo}`;
  $("studentIdDisplay").textContent = `Student ID: ${report.studentId}`;
  $("totalScore").textContent = `${report.totalScore}/${report.maximumScore}`;
  $("percent").textContent = `${report.percentage}% in subject questions`;
  $("interestSummary").textContent = report.interestText;
  $("careerProfile").textContent = `Leading interests: ${report.topInterests.join(", ") || "To be explored with a counsellor"}`;

  $("subjectScores").innerHTML = report.sectionReport.map(item => `
    <div class="resultcard score-row">
      <div class="score-row-heading"><strong>${escapeHTML(item.section)}</strong><span>${item.score}/${item.maximum} correct</span></div>
      <div class="progress"><div style="width:${item.percentage}%"></div></div>
      <div class="small">${item.percentage.toFixed(0)}% score</div>
    </div>`).join("");

  $("pathways").innerHTML = report.pathways.map(item => `
    <div class="path"><strong>${escapeHTML(item.name)}</strong><p>${escapeHTML(item.description)}</p></div>`).join("");

  $("answerSummary").innerHTML = report.answerReport.map(item => `
    <div class="answer-row">
      <div><strong>Q${item.questionNumber}. ${escapeHTML(item.section)}</strong><span class="small">${escapeHTML(item.difficulty)}</span></div>
      <p>${escapeHTML(item.question)}</p>
      <p class="small">Selected: ${escapeHTML(item.selectedAnswer)} · ${escapeHTML(item.result)}</p>
      ${item.result !== "Not scored" ? `<p class="small">Correct answer: ${escapeHTML(item.correctAnswer)}</p>` : ""}
    </div>`).join("");
}

async function saveReportToGoogleSheets(report) {
  const status = $("saveStatus");
  if (!GOOGLE_SCRIPT_URL || !GOOGLE_SCRIPT_URL.endsWith("/exec")) {
    status.textContent = "Google Sheets saving is not configured.";
    return;
  }

  const payload = {
    studentId: report.studentId,
    studentName: report.studentName,
    contactNumber: report.contactNumber,
    email: report.email,
    studentClass: report.studentClass,
    subjectCombo: report.subjectCombo,
    cityName: report.cityName,
    schoolName: report.schoolName,
    totalScore: report.totalScore,
    maximumScore: report.maximumScore,
    percentage: report.percentage,
    interestText: report.interestText,
    pathways: report.pathways,
    sectionReport: report.sectionReport,
    answerReport: report.answerReport,
    reportText: report.reportText,
    submittedAt: report.submittedAt
  };

  try {
    status.textContent = "Sending result to Google Sheets…";
    const body = new URLSearchParams();
    body.append("payload", JSON.stringify(payload));
    await fetch(GOOGLE_SCRIPT_URL, {
      method: "POST",
      mode: "no-cors",
      redirect: "follow",
      body
    });
    status.textContent = "Result submission request sent to Google Sheets. Verify the Students sheet for the student ID above.";
  } catch (error) {
    console.error("AIHER Google Sheets submission error:", error);
    status.textContent = "The result could not be sent to Google Sheets: " + error.message;
  }
}

async function submitTest() {
  if (answers.some(answer => answer === null)) {
    const missing = answers.findIndex(answer => answer === null);
    current = missing;
    renderQuestion();
    alert(`Please answer Question ${missing + 1} before submitting.`);
    return;
  }

  finalReport = createReport();
  displayReport(finalReport);
  $("testPage").classList.add("hidden");
  $("resultPanel").classList.remove("hidden");
  $("resultPanel").classList.add("page-enter");
  window.scrollTo({ top: 0, behavior: "smooth" });
  await saveReportToGoogleSheets(finalReport);
}

function downloadPDF() {
  if (!finalReport) return alert("Please submit the test before downloading the report.");
  if (!window.jspdf || !window.jspdf.jsPDF) {
    alert("The PDF library could not load. Use Print Report, then choose Save as PDF.");
    window.print();
    return;
  }

  const { jsPDF } = window.jspdf;
  const doc = new jsPDF({ unit: "mm", format: "a4" });
  const left = 16;
  const pageWidth = 178;
  let y = 18;

  const addLine = (text, size = 10, bold = false, gap = 6) => {
    doc.setFont("helvetica", bold ? "bold" : "normal");
    doc.setFontSize(size);
    const lines = doc.splitTextToSize(String(text), pageWidth);
    if (y + lines.length * (size * 0.45) > 278) {
      doc.addPage();
      y = 18;
    }
    doc.text(lines, left, y);
    y += lines.length * (size * 0.45) + gap;
  };

  doc.setFont("helvetica", "bold");
  doc.setFontSize(17);
  doc.text("AIHER SCIENCE CAREER DISCOVERY REPORT", left, y);
  y += 10;
  addLine(`Student ID: ${finalReport.studentId}`, 10, true);
  addLine(`Student Name: ${finalReport.studentName}`);
  addLine(`Contact: ${finalReport.contactNumber} | Email: ${finalReport.email || "Not provided"}`);
  addLine(`Class: ${finalReport.studentClass} | Subject Combination: ${finalReport.subjectCombo}`);
  addLine(`City: ${finalReport.cityName} | City Name: ${finalReport.cityName}`)
  addLine(`School Name: ${finalReport.schoolName} | School Name: ${finalReport.schoolName}`)
  addLine(`Submitted: ${new Date(finalReport.submittedAt).toLocaleString()}`);
  addLine(`SUBJECT KNOWLEDGE SCORE: ${finalReport.totalScore}/${finalReport.maximumScore} (${finalReport.percentage}%)`, 12, true, 8);

  addLine("SECTION-WISE PERFORMANCE", 12, true, 5);
  finalReport.sectionReport.forEach(item => addLine(`${item.section}: ${item.score}/${item.maximum} (${item.percentage.toFixed(0)}%)`));

  addLine("CAREER INTEREST SNAPSHOT", 12, true, 5);
  addLine(finalReport.interestText);
  addLine("CAREER PATHWAYS TO EXPLORE", 12, true, 5);
  finalReport.pathways.forEach(item => {
    addLine(item.name, 10, true, 2);
    addLine(item.description, 9, false, 5);
  });

  addLine("QUESTION-WISE RESPONSES", 12, true, 5);
  finalReport.answerReport.forEach(item => {
    addLine(`Q${item.questionNumber}. ${item.question}`, 9, true, 2);
    addLine(`Selected: ${item.selectedAnswer} | ${item.result}${item.result === "Not scored" ? "" : ` | Correct answer: ${item.correctAnswer}`}`, 8, false, 4);
  });

  addLine("Note: This is an exploratory guidance activity, not a validated psychometric test or guaranteed career prediction. Discuss course options and eligibility with a qualified counsellor.", 8, false, 4);
  doc.save(`AIHER_Career_Report_${finalReport.studentId}.pdf`);
}

// Expose functions used by inline HTML handlers.
window.continueToTest = continueToTest;
window.beginQuiz = beginQuiz;
window.move = move;
window.submitTest = submitTest;
window.downloadPDF = downloadPDF;
