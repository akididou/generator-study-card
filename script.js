document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('studentForm');
    const cardSection = document.getElementById('cardSection');
    const exportBtn = document.getElementById('exportPdf');

    form.addEventListener('submit', function(e) {
        e.preventDefault();
        generateCard();
    });

    exportBtn.addEventListener('click', function() {
        exportToPDF();
    });

    function generateCard() {
        const nom = document.getElementById('nom').value.toUpperCase();
        const prenom = document.getElementById('prenom').value.toUpperCase();
        const dateNaissance = document.getElementById('dateNaissance').value;
        const photoFile = document.getElementById('photo').files[0];

        document.getElementById('cardNom').textContent = nom;
        document.getElementById('cardPrenom').textContent = prenom;

        const formattedDate = formatDate(dateNaissance);
        document.getElementById('cardDateNaissance').textContent = formattedDate;

        const currentYear = new Date().getFullYear();
        document.getElementById('cardValidite').textContent = `${currentYear}-${currentYear + 1}`;

        if (photoFile) {
            const reader = new FileReader();
            reader.onload = function(e) {
                document.getElementById('cardPhoto').src = e.target.result;
            };
            reader.readAsDataURL(photoFile);
        }

        generateRandomSignature();
        cardSection.style.display = 'block';
    }

    function formatDate(dateString) {
        const date = new Date(dateString);
        const day = String(date.getDate()).padStart(2, '0');
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const year = date.getFullYear();
        return `${day}/${month}/${year}`;
    }

    function generateRandomSignature() {
        const canvas = document.getElementById('signatureCanvas');
        const ctx = canvas.getContext('2d');

        ctx.clearRect(0, 0, canvas.width, canvas.height);

        ctx.strokeStyle = '#000';
        ctx.lineWidth = 2;
        ctx.lineCap = 'round';
        ctx.lineJoin = 'round';

        ctx.beginPath();

        const startX = 20;
        const startY = 30;
        const endX = 180;
        const endY = 35;

        const controlPoints = [];
        const numPoints = 8;

        for (let i = 0; i <= numPoints; i++) {
            const t = i / numPoints;
            const x = startX + (endX - startX) * t + (Math.random() - 0.5) * 30;
            const y = startY + (endY - startY) * t + (Math.random() - 0.5) * 20;
            controlPoints.push({ x, y });
        }

        ctx.moveTo(controlPoints[0].x, controlPoints[0].y);

        for (let i = 1; i < controlPoints.length - 2; i++) {
            const xc = (controlPoints[i].x + controlPoints[i + 1].x) / 2;
            const yc = (controlPoints[i].y + controlPoints[i + 1].y) / 2;
            ctx.quadraticCurveTo(controlPoints[i].x, controlPoints[i].y, xc, yc);
        }

        ctx.quadraticCurveTo(
            controlPoints[controlPoints.length - 2].x,
            controlPoints[controlPoints.length - 2].y,
            controlPoints[controlPoints.length - 1].x,
            controlPoints[controlPoints.length - 1].y
        );

        if (Math.random() > 0.5) {
            const loopX = startX + (Math.random() * 50);
            const loopY = startY - (Math.random() * 15);
            ctx.moveTo(loopX, loopY);
            ctx.arc(loopX + 10, loopY, 8, 0, Math.PI * 2);
        }

        if (Math.random() > 0.7) {
            ctx.moveTo(endX - 20, endY - 10);
            ctx.lineTo(endX - 10, endY + 5);
            ctx.lineTo(endX, endY - 5);
        }

        ctx.stroke();
    }

    function exportToPDF() {
        const { jsPDF } = window.jspdf;
        const card = document.getElementById('studentCard');

        html2canvas(card, {
            scale: 2,
            useCORS: true,
            allowTaint: true,
            backgroundColor: null
        }).then(canvas => {
            const imgData = canvas.toDataURL('image/png');
            const pdf = new jsPDF({
                orientation: 'landscape',
                unit: 'mm',
                format: [85.6, 53.98]
            });

            const imgWidth = 85.6;
            const imgHeight = 53.98;

            pdf.addImage(imgData, 'PNG', 0, 0, imgWidth, imgHeight);

            const nom = document.getElementById('nom').value;
            const prenom = document.getElementById('prenom').value;
            const fileName = `carte_etudiant_${prenom}_${nom}.pdf`;

            pdf.save(fileName);
        }).catch(error => {
            console.error('Erreur lors de la génération du PDF:', error);
            alert('Erreur lors de la génération du PDF. Veuillez réessayer.');
        });
    }
});