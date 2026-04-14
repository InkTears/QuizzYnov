import React, { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import quizService from '../api/quizApi';

type CsvQuestion = {
    content: string;
    option_a: string;
    option_b: string;
    option_c: string;
    option_d: string;
    correct_answers: 'A' | 'B' | 'C' | 'D';
};

const BATCH_SIZE = 100;

const splitCsvLine = (line: string): string[] => {
    const values: string[] = [];
    let current = '';
    let inQuotes = false;

    for (let i = 0; i < line.length; i += 1) {
        const char = line[i];
        if (char === '"') {
            if (inQuotes && line[i + 1] === '"') {
                current += '"';
                i += 1;
            } else {
                inQuotes = !inQuotes;
            }
        } else if ((char === ';' || char === ',') && !inQuotes) {
            values.push(current.trim());
            current = '';
        } else {
            current += char;
        }
    }

    values.push(current.trim());
    return values.map((value) => value.replace(/^"(.*)"$/, '$1').trim());
};

const parseCsv = (content: string): { rows: CsvQuestion[]; invalidCount: number } => {
    const lines = content
        .split(/\r?\n/)
        .map((line) => line.trim())
        .filter((line) => line.length > 0);

    if (lines.length < 2) {
        return { rows: [], invalidCount: 0 };
    }

    const header = splitCsvLine(lines[0]).map((col) => col.toLowerCase());
    const requiredHeader = ['content', 'option_a', 'option_b', 'option_c', 'option_d', 'correct_answers'];
    const hasValidHeader = requiredHeader.every((column, index) => header[index] === column);

    if (!hasValidHeader) {
        throw new Error('En-tetes invalides. Attendu: content,option_a,option_b,option_c,option_d,correct_answers');
    }

    const rows: CsvQuestion[] = [];
    let invalidCount = 0;

    for (let i = 1; i < lines.length; i += 1) {
        const columns = splitCsvLine(lines[i]);
        if (columns.length < 6) {
            invalidCount += 1;
            continue;
        }

        const [contentCell, a, b, c, d, correctRaw] = columns;
        const correct = (correctRaw || '').toUpperCase() as CsvQuestion['correct_answers'];

        if (!contentCell || !a || !b || !c || !d || !['A', 'B', 'C', 'D'].includes(correct)) {
            invalidCount += 1;
            continue;
        }

        rows.push({
            content: contentCell,
            option_a: a,
            option_b: b,
            option_c: c,
            option_d: d,
            correct_answers: correct,
        });
    }

    return { rows, invalidCount };
};

const toBatches = <T,>(items: T[], size: number): T[][] => {
    const batches: T[][] = [];
    for (let i = 0; i < items.length; i += size) {
        batches.push(items.slice(i, i + size));
    }
    return batches;
};

const CRUDQuestionAdmin: React.FC = () => {
    const navigate = useNavigate();
    const [questionCount, setQuestionCount] = useState(0);
    const [isImporting, setIsImporting] = useState(false);
    const [message, setMessage] = useState('');

    const role = (localStorage.getItem('userRole') || '').toLowerCase().trim();
    const isAdmin = role === 'admin';

    const refreshCount = async () => {
        const data = await quizService.getAllQuestions();
        setQuestionCount(Array.isArray(data) ? data.length : 0);
    };

    useEffect(() => {
        refreshCount().catch(() => {
            setMessage('Impossible de charger le nombre de questions.');
        });
    }, []);

    const expectedHeader = useMemo(
        () => 'content,option_a,option_b,option_c,option_d,correct_answers',
        []
    );

    const handleFile = async (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        event.target.value = '';

        if (!file) {
            return;
        }

        if (!file.name.toLowerCase().endsWith('.csv')) {
            setMessage('Fichier invalide. Importez un CSV.');
            return;
        }

        setIsImporting(true);
        setMessage('');

        try {
            const csvContent = await file.text();
            const { rows, invalidCount } = parseCsv(csvContent);

            if (rows.length === 0) {
                setMessage('Aucune ligne valide dans le CSV.');
                return;
            }

            const batches = toBatches(rows, BATCH_SIZE);
            let inserted = 0;

            for (let i = 0; i < batches.length; i += 1) {
                const batch = batches[i];
                await quizService.importBatch(batch);
                inserted += batch.length;
            }

            await refreshCount();
            setMessage(
                `Import termine: ${inserted} questions ajoutees en ${batches.length} batch(es) de max ${BATCH_SIZE}. ${invalidCount} ligne(s) ignoree(s).`
            );
        } catch (error) {
            setMessage(error instanceof Error ? error.message : "Erreur pendant l'import CSV.");
        } finally {
            setIsImporting(false);
        }
    };

    if (!isAdmin) {
        return <p style={{ padding: '2rem', textAlign: 'center' }}>Acces refuse.</p>;
    }

    return (
        <div style={{ maxWidth: '760px', margin: '2rem auto', padding: '0 1rem', textAlign: 'left' }}>
            <h1>Administration - Import CSV</h1>
            <p>Questions en base: <strong>{questionCount}</strong></p>

            <button
                type="button"
                onClick={() => navigate('/profile')}
                style={{ marginBottom: '1rem', padding: '0.5rem 1rem', cursor: 'pointer' }}
            >
                Retour profil
            </button>

            <div style={{ padding: '1rem', border: '1px solid #ddd', borderRadius: '8px' }}>
                <p style={{ marginTop: 0 }}>
                    En-tete CSV attendu: <code>{expectedHeader}</code>
                </p>
                <p>Chaque ligne represente une question. La colonne <code>correct_answers</code> accepte A, B, C ou D.</p>

                <input type="file" accept=".csv" onChange={handleFile} disabled={isImporting} />
            </div>

            {message ? <p style={{ marginTop: '1rem' }}>{message}</p> : null}
        </div>
    );
};

export default CRUDQuestionAdmin;
