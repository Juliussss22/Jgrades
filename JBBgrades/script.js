document.addEventListener('DOMContentLoaded', function() {
            // Beispieldaten
            const subjects = [
                {
                    id: Date.now() + 1,
                    name: "Mathematik",
                    exams: [],
                    oral: [],
                    weight: 2
                },
                {
                    id: Date.now() + 2,
                    name: "Deutsch",
                    exams: [],
                    oral: [],
                    weight: 2
                },
                {
                    id: Date.now() + 3,
                    name: "Englisch",
                    exams: [],
                    oral: [],
                    weight: 2
                }
            ];

            const subjectsContainer = document.querySelector('.subjects-container');
            const addSubjectBtn = document.getElementById('add-subject-btn');
            const subjectSelect = document.getElementById('subject-select');
            const overallGradeDisplay = document.querySelector('.grade-display');
            const overallGradeStatus = document.querySelector('.grade-status');
            const schoolModeBtn = document.getElementById('school-mode');
            const abiModeBtn = document.getElementById('abi-mode');
            const customSubjectModal = document.getElementById('custom-subject-modal');
            const closeModalBtn = document.querySelector('.close-modal');
            const addCategoryBtn = document.getElementById('add-category-btn');
            const saveCustomSubjectBtn = document.getElementById('save-custom-subject');
            
            let currentMode = 'school'; // 'school' oder 'abi'

            // Initiale Fächer rendern
            subjects.forEach(subject => {
                addSubjectCard(subject);
            });
            updateOverallGrade();

            // Neues Fach hinzufügen
            addSubjectBtn.addEventListener('click', function() {
                const subjectName = subjectSelect.value;
                if (subjectName === "custom") {
                    customSubjectModal.style.display = 'block';
                } else if (subjectName) {
                    const newSubject = {
                        id: Date.now(),
                        name: subjectName,
                        exams: [],
                        oral: [],
                        weight: 2
                    };
                    subjects.push(newSubject);
                    addSubjectCard(newSubject);
                    updateOverallGrade();
                }
            });

            // Modus wechseln
            schoolModeBtn.addEventListener('click', function() {
                currentMode = 'school';
                schoolModeBtn.classList.add('active');
                abiModeBtn.classList.remove('active');
                updateAllCards();
            });

            abiModeBtn.addEventListener('click', function() {
                currentMode = 'abi';
                abiModeBtn.classList.add('active');
                schoolModeBtn.classList.remove('active');
                updateAllCards();
            });

            // Modal schließen
            closeModalBtn.addEventListener('click', function() {
                customSubjectModal.style.display = 'none';
            });

            // Kategorie hinzufügen
            addCategoryBtn.addEventListener('click', function() {
                const categoriesContainer = document.getElementById('categories-container');
                const categoryItem = document.createElement('div');
                categoryItem.className = 'category-item';
                categoryItem.innerHTML = `
                    <button class="delete-category"><i class="fas fa-times"></i></button>
                    <div class="input-group">
                        <label>Kategoriename</label>
                        <input type="text" class="category-name" value="Neue Kategorie">
                    </div>
                    <div class="input-group">
                        <label>Gewichtung</label>
                        <input type="number" min="1" step="1" class="category-weight" value="1">
                    </div>
                `;
                categoriesContainer.appendChild(categoryItem);
                
                // Delete-Button Event hinzufügen
                const deleteBtn = categoryItem.querySelector('.delete-category');
                deleteBtn.addEventListener('click', function() {
                    categoriesContainer.removeChild(categoryItem);
                });
            });

            // Benutzerdefiniertes Fach speichern
            saveCustomSubjectBtn.addEventListener('click', function() {
                const subjectName = document.getElementById('custom-subject-name').value;
                const formula = document.getElementById('calculation-formula').value;
                
                if (!subjectName) {
                    alert("Bitte gib einen Namen ein.");
                    return;
                }
                
                const newSubject = {
                    id: Date.now(),
                    name: subjectName,
                    exams: [],
                    oral: [],
                    weight: 2,
                    custom: true,
                    formula: formula
                };
                
                subjects.push(newSubject);
                addSubjectCard(newSubject);
                updateOverallGrade();
                customSubjectModal.style.display = 'none';
            });

            // Neue Funktion zur Berechnung der Farbe basierend auf der Note
            function getGradeColor(grade, mode) {
                if (mode === 'school') {
                    if (grade <= 1.5) return 'var(--grade-1)';
                    if (grade <= 2.5) return 'var(--grade-2)';
                    if (grade <= 3.5) return 'var(--grade-3)';
                    if (grade <= 4.5) return 'var(--grade-4)';
                    if (grade <= 5.5) return 'var(--grade-5)';
                    return 'var(--grade-6)';
                } else {
                    // Für Abi-Modus
                    if (grade >= 14) return 'var(--grade-1)';
                    if (grade >= 11) return 'var(--grade-2)';
                    if (grade >= 8) return 'var(--grade-3)';
                    if (grade >= 5) return 'var(--grade-4)';
                    return 'var(--grade-5)';
                }
            }

            // Funktion zur Aktualisierung der Gesamtnoten-Farbe
            function updateOverallGradeColor(grade, mode) {
                const overallGrade = document.querySelector('.overall-grade');
                const gradeDisplay = document.querySelector('.grade-display');
                
                const color = getGradeColor(grade, mode);
                gradeDisplay.style.color = color;
                
                // Hintergrund mit leichtem Farbverlauf
                overallGrade.style.background = `
                    linear-gradient(
                        to right,
                        ${color}00,
                        ${color}15,
                        var(--card-bg) 60%
                    )
                `;
            }

            // Fachkarte erstellen
            function addSubjectCard(subject) {
                const card = document.createElement('div');
                card.className = 'subject-card';
                card.dataset.id = subject.id;
                card.dataset.name = subject.name;
                
                card.innerHTML = `
                    <button class="close-expanded-btn"><i class="fas fa-caret-up"></i></button>
                    <button class="delete-subject-btn"><i class="fas fa-trash-alt"></i></button>
                    <div class="subject-header">
                        <div class="subject-name">${subject.name}</div>
                        <div class="subject-grade">${formatGrade(calculateSubjectAverage(subject))}</div>
                    </div>
                    
                    <div class="subject-meta">
                        <div><i class="fas fa-weight-hanging"></i> Gewichtung: ${subject.weight}x</div>
                        <div><i class="fas fa-sticky-note"></i> ${subject.exams.length + subject.oral.length} Noten</div>
                    </div>
                    
                    <div class="subject-notes">
                        ${subject.exams.map(grade => `
                            <div class="grade-item double">
                                ${formatGrade(grade)}
                                <div class="weight">${subject.weight}x</div>
                            </div>
                        `).join('')}
                        ${subject.oral.map(grade => `
                            <div class="grade-item">
                                ${formatGrade(grade)}
                            </div>
                        `).join('')}
                    </div>
                    
                    <div class="subject-content">
                        <div class="grade-input-section">
                            <div class="section-title">
                                <i class="fas fa-file-alt"></i>
                                Schulaufgaben 
                            </div>
                            <div class="input-group">
                                <input type="number" min="1" max="${currentMode === 'school' ? '6' : '15'}" step="0.25" placeholder="Note (${currentMode === 'school' ? '1-6' : '0-15'})" class="exam-input">
                                <select class="weight-select">
                                    <option value="1">1x</option>
                                    <option value="2" selected>2x</option>
                                    <option value="3">3x</option>
                                </select>
                                <button class="add-exam-btn"><i class="fas fa-plus"></i></button>
                            </div>
                            <div class="grade-list exam-list"></div>
                        </div>
                        
                        <div class="grade-input-section">
                            <div class="section-title">
                                <i class="fas fa-comments"></i>
                                Tests
                            </div>
                            <div class="input-group">
                                <input type="number" min="1" max="${currentMode === 'school' ? '6' : '15'}" step="0.25" placeholder="Note (${currentMode === 'school' ? '1-6' : '0-15'})" class="oral-input">
                                <button class="add-oral-btn"><i class="fas fa-plus"></i></button>
                            </div>
                            <div class="grade-list oral-list"></div>
                        </div>
                        
                        <div class="improvement-hint">
                            <h4><i class="fas fa-lightbulb"></i> Verbesserungstipp</h4>
                            <p>Für eine bessere Durchschnittsnote benötigst du in der nächsten Arbeit mindestens: <strong>${calculateImprovementHint(subject)}</strong></p>
                        </div>
                    </div>
                `;
                
                subjectsContainer.appendChild(card);
                
                // Setze die Farbe basierend auf dem Fachdurchschnitt
                const average = calculateSubjectAverage(subject);
                const color = getGradeColor(average, currentMode);
                const subjectGradeDisplay = card.querySelector('.subject-grade');
                subjectGradeDisplay.style.color = color;
                
                // Event-Listener für die neuen Buttons
                const addExamBtn = card.querySelector('.add-exam-btn');
                const addOralBtn = card.querySelector('.add-oral-btn');
                const examInput = card.querySelector('.exam-input');
                const oralInput = card.querySelector('.oral-input');
                const examList = card.querySelector('.exam-list');
                const oralList = card.querySelector('.oral-list');
                const weightSelect = card.querySelector('.weight-select');
                const closeExpandedBtn = card.querySelector('.close-expanded-btn');
                const deleteSubjectBtn = card.querySelector('.delete-subject-btn');
                
                // Gewichtung setzen
                weightSelect.value = subject.weight;
                
                // Gewichtung ändern
                weightSelect.addEventListener('change', function() {
                    subject.weight = parseInt(this.value);
                    const newAverage = calculateSubjectAverage(subject);
                    animateGradeChange(subjectGradeDisplay, newAverage);
                    updateOverallGrade();
                    
                    // Gewichtungsanzeige aktualisieren
                    const weightDisplay = card.querySelector('.subject-meta div:first-child');
                    weightDisplay.innerHTML = `<i class="fas fa-weight-hanging"></i> Gewichtung: ${subject.weight}x`;
                    
                    // Verbesserungshinweis aktualisieren
                    const hint = card.querySelector('.improvement-hint p strong');
                    hint.textContent = calculateImprovementHint(subject);
                });
                
                // Noten hinzufügen
                addExamBtn.addEventListener('click', function() {
                    addGrade(examInput, subject.exams, examList, true, subject, subjectGradeDisplay);
                });
                
                addOralBtn.addEventListener('click', function() {
                    addGrade(oralInput, subject.oral, oralList, false, subject, subjectGradeDisplay);
                });
                
                // Bestehende Noten rendern
                subject.exams.forEach(grade => {
                    renderGrade(grade, examList, true, subject, subject.exams);
                });
                
                subject.oral.forEach(grade => {
                    renderGrade(grade, oralList, false, subject, subject.oral);
                });
                
                // Karte expandieren/kollabieren
                card.addEventListener('click', function(e) {
                    if (!e.target.classList.contains('add-exam-btn') && 
                        !e.target.classList.contains('add-oral-btn') &&
                        !e.target.classList.contains('delete-grade') &&
                        !e.target.classList.contains('close-expanded-btn') &&
                        !e.target.classList.contains('delete-subject-btn')) {
                        this.classList.add('expanded');
                    }
                });
                
                // Schließen-Button Event
                closeExpandedBtn.addEventListener('click', function(e) {
                    e.stopPropagation();
                    card.classList.remove('expanded');
                });
                
                // Fach löschen
                deleteSubjectBtn.addEventListener('click', function(e) {
                    e.stopPropagation();
                    const subjectName = card.dataset.name;
                    
                    if (confirm(`Möchten Sie das Fach "${subjectName}" wirklich löschen?`)) {
                        // Fach aus dem Array entfernen
                        const index = subjects.findIndex(s => s.id === subject.id);
                        if (index !== -1) {
                            subjects.splice(index, 1);
                        }
                        
                        // Animation zum Entfernen
                        card.classList.add('fly-out');
                        card.addEventListener('animationend', () => {
                            card.remove();
                            updateOverallGrade();
                        });
                    }
                });
            }

            // Note animiert aktualisieren
            function animateGradeChange(element, newGrade) {
                element.classList.add('grade-change');
                element.textContent = formatGrade(newGrade);
                element.style.color = getGradeColor(newGrade, currentMode);
                
                setTimeout(() => {
                    element.classList.remove('grade-change');
                }, 1000);
            }

            // Note hinzufügen
            function addGrade(input, gradeArray, list, isExam, subject, subjectGradeDisplay) {
                let grade = parseFloat(input.value);
                
                // Eingabe validieren
                if (isNaN(grade)) return;
                
                if (currentMode === 'school') {
                    if (grade < 1 || grade > 6) {
                        alert('Bitte eine Note zwischen 1 und 6 eingeben!');
                        return;
                    }
                } else {
                    if (grade < 0 || grade > 15) {
                        alert('Bitte Punkte zwischen 0 und 15 eingeben!');
                        return;
                    }
                }
                
                gradeArray.push(grade);
                renderGrade(grade, list, isExam, subject, gradeArray);
                input.value = '';
                
                // Fachschnitt aktualisieren mit Animation
                const newAverage = calculateSubjectAverage(subject);
                animateGradeChange(subjectGradeDisplay, newAverage);
                
                // Gesamtschnitt aktualisieren
                updateOverallGrade();
                
                // Verbesserungshinweis aktualisieren
                const card = document.querySelector(`.subject-card[data-id="${subject.id}"]`);
                const hint = card.querySelector('.improvement-hint p strong');
                hint.textContent = calculateImprovementHint(subject);
            }

            // Note rendern
            function renderGrade(grade, list, isExam, subject, gradeArray) {
                const gradeItem = document.createElement('div');
                gradeItem.className = `grade-item ${isExam ? (subject.weight === 3 ? 'triple' : 'double') : ''}`;
                
                gradeItem.innerHTML = `
                    ${formatGrade(grade)}
                    ${isExam ? `<div class="weight">${subject.weight}x</div>` : ''}
                    <button class="delete-grade"><i class="fas fa-times"></i></button>
                `;
                
                list.appendChild(gradeItem);
                
                // Note löschen
                const deleteBtn = gradeItem.querySelector('.delete-grade');
                deleteBtn.addEventListener('click', function(e) {
                    e.stopPropagation();
                    
                    const index = gradeArray.indexOf(grade);
                    if (index > -1) {
                        gradeArray.splice(index, 1);
                    }
                    list.removeChild(gradeItem);
                    
                    // Fachschnitt aktualisieren mit Animation
                    const subjectCard = list.closest('.subject-card');
                    const subjectGradeDisplay = subjectCard.querySelector('.subject-grade');
                    const newAverage = calculateSubjectAverage(subject);
                    animateGradeChange(subjectGradeDisplay, newAverage);
                    
                    // Gesamtschnitt aktualisieren
                    updateOverallGrade();
                    
                    // Verbesserungshinweis aktualisieren
                    const hint = subjectCard.querySelector('.improvement-hint p strong');
                    hint.textContent = calculateImprovementHint(subject);
                });
            }

            // Fachschnitt berechnen
            function calculateSubjectAverage(subject) {
                if (subject.exams.length === 0 && subject.oral.length === 0) return 0.0;
                
                // Schulaufgaben-Schnitt (gewichteter Schnitt)
                let examSum = subject.exams.reduce((sum, grade) => sum + grade, 0);
                let examAvg = subject.exams.length > 0 ? examSum / subject.exams.length : 0;
                
                // Mündlicher Schnitt
                let oralSum = subject.oral.reduce((sum, grade) => sum + grade, 0);
                let oralAvg = subject.oral.length > 0 ? oralSum / subject.oral.length : 0;
                
                // Kombinierter Schnitt
                const totalWeight = (subject.exams.length * subject.weight) + subject.oral.length;
                const weightedSum = (examAvg * subject.exams.length * subject.weight) + (oralAvg * subject.oral.length);
                
                return totalWeight > 0 ? weightedSum / totalWeight : 0;
            }

            // Gesamtschnitt aktualisieren
            function updateOverallGrade() {
                const subjectCards = document.querySelectorAll('.subject-card');
                let total = 0;
                let count = 0;
                
                subjectCards.forEach(card => {
                    const gradeText = card.querySelector('.subject-grade').textContent;
                    const grade = parseFloat(gradeText.replace(',', '.'));
                    if (!isNaN(grade) && grade > 0) {
                        total += grade;
                        count++;
                    }
                });
                
                const overallAverage = count > 0 ? total / count : 0;
                overallGradeDisplay.textContent = formatGrade(overallAverage);
                
                // Farbe aktualisieren
                updateOverallGradeColor(overallAverage, currentMode);
                
                // Status-Text aktualisieren
                let statusText = "";
                if (currentMode === 'school') {
                    if (overallAverage < 1.5) {
                        statusText = "Sehr Gut";
                    } else if (overallAverage < 2.5) {
                        statusText = "Gut";
                    } else if (overallAverage < 3.5) {
                        statusText = "Befriedigend";
                    } else if (overallAverage < 4.5) {
                        statusText = "Ausreichend";
                    } else if (overallAverage < 5.5) {
                        statusText = "Mangelhaft";
                    } else {
                        statusText = "Ungenügend";
                    }
                } else {
                    if (overallAverage >= 14) {
                        statusText = "Hervorragend";
                    } else if (overallAverage >= 11) {
                        statusText = "Sehr Gut";
                    } else if (overallAverage >= 8) {
                        statusText = "Gut";
                    } else if (overallAverage >= 5) {
                        statusText = "Befriedigend";
                    } else {
                        statusText = "Ausreichend";
                    }
                }
                
                overallGradeStatus.textContent = `Aktuell: ${statusText}`;
                
                // Animation für Änderungen
                overallGradeDisplay.classList.add('pulse');
                setTimeout(() => {
                    overallGradeDisplay.classList.remove('pulse');
                }, 1500);
            }
            
            // Verbesserungshinweis berechnen
            function calculateImprovementHint(subject) {
                if (subject.exams.length === 0 && subject.oral.length === 0) {
                    return currentMode === 'school' ? "1.0" : "15";
                }
                
                const currentAverage = calculateSubjectAverage(subject);
                let nextGrade;
                
                if (currentMode === 'school') {
                    // Auf nächst kleinere ganze Zahl abrunden (z.B. 2.34 -> 2.0)
                    nextGrade = Math.floor(currentAverage);
                    // Mindestens 1.0
                    if (nextGrade < 1) nextGrade = 1;
                } else {
                    // Auf nächst höhere ganze Zahl aufrunden (z.B. 10.1 -> 11)
                    nextGrade = Math.ceil(currentAverage);
                    // Maximal 15
                    if (nextGrade > 15) nextGrade = 15;
                }
                
                return formatGrade(nextGrade);
            }
            
            // Note formatieren
            function formatGrade(grade) {
                if (currentMode === 'school') {
                    return grade.toFixed(2).replace('.', ',');
                } else {
                    return grade.toFixed(1).replace('.', ',');
                }
            }
            
            // Alle Karten aktualisieren (bei Moduswechsel)
            function updateAllCards() {
                subjectsContainer.innerHTML = '';
                subjects.forEach(subject => {
                    addSubjectCard(subject);
                });
                updateOverallGrade();
            }

            // Interaktion für das neue Fachauswahl-Menü
            const subjectSelectContainer = document.querySelector('.subject-select-container');
            
            subjectSelect.addEventListener('focus', () => {
                subjectSelectContainer.classList.add('active');
            });
            
            subjectSelect.addEventListener('blur', () => {
                subjectSelectContainer.classList.remove('active');
            });
        });