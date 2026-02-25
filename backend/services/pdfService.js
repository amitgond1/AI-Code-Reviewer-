import PDFDocument from "pdfkit";

export const buildReviewPdf = (review, user) =>
  new Promise((resolve, reject) => {
    const doc = new PDFDocument({ margin: 40 });
    const chunks = [];

    doc.on("data", (chunk) => chunks.push(chunk));
    doc.on("end", () => resolve(Buffer.concat(chunks)));
    doc.on("error", reject);

    doc
      .fontSize(20)
      .text("AI Code Review Report", { align: "center" })
      .moveDown(1)
      .fontSize(11)
      .text(`User: ${user.name} (${user.email})`)
      .text(`Language: ${review.language}`)
      .text(`Score: ${review.score}/100`)
      .text(`Lines of Code: ${review.linesOfCode}`)
      .text(`Date: ${new Date(review.createdAt).toLocaleString()}`)
      .moveDown();

    const sections = [
      ["Bugs", review.bugs],
      ["Improvements", review.improvements],
      ["Time Complexity", review.time_complexity],
      ["Space Complexity", review.space_complexity],
      ["Code Smells", review.code_smells],
      ["Security Warnings", review.security_warnings],
      ["Duplicate Code", review.duplicate_code],
      ["Performance Suggestions", review.performance_suggestions],
      ["Naming Suggestions", review.naming_suggestions],
      ["Better Code", review.better_code]
    ];

    sections.forEach(([title, content]) => {
      doc
        .fontSize(13)
        .fillColor("#4F46E5")
        .text(title)
        .fillColor("black")
        .fontSize(10)
        .text(content || "N/A")
        .moveDown(0.8);
    });

    doc.end();
  });
