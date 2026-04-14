import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Alert,
  Box,
  Button,
  CircularProgress,
  Container,
  Paper,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography
} from '@mui/material';

import Header from '../components/layout/Header';
import authService from '../services/authService';
import profileService from '../services/profileService';
import type { PlayerSession } from '../types/Profile';

function formatSessionDate(value: string): string {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    return value;
  }

  return new Intl.DateTimeFormat('fr-FR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  }).format(date);
}

export default function ProfilePage() {
  const navigate = useNavigate();
  const [sessions, setSessions] = useState<PlayerSession[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [role, setRole] = useState<string>((localStorage.getItem('userRole') || '').toLowerCase().trim());

  useEffect(() => {
    if (!authService.isAuthenticated()) {
      navigate('/login', { replace: true });
      return;
    }

    const loadSessions = async () => {
      try {
        const sessionUser = await authService.syncSessionUser();
        if (sessionUser?.role) {
          setRole(sessionUser.role.toLowerCase());
        }
      } catch {
        // On garde le role local si la synchro serveur echoue.
      }

      try {
        const data = await profileService.getMySessions();
        setSessions(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Erreur de chargement du profil');
      } finally {
        setIsLoading(false);
      }
    };

    loadSessions();
  }, [navigate]);

  const playerName = useMemo(() => {
    if (sessions.length > 0 && sessions[0].userName) {
      return sessions[0].userName;
    }

    return localStorage.getItem('userName') || 'Joueur';
  }, [sessions]);

  const isAdmin = role === 'admin';

  return (
    <Box sx={{ minHeight: '100vh', backgroundColor: '#f8fafc' }}>
      <Header />

      <Container maxWidth="sm" sx={{ py: 2 }}>
        <Stack spacing={2}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="h5" fontWeight={700}>
              Profil
            </Typography>
            <Typography variant="body1" color="text.secondary" sx={{ mt: 1 }}>
              Joueur: {playerName}
            </Typography>
          </Paper>

          <Paper sx={{ p: 2 }}>
            <Typography variant="h6" fontWeight={600} sx={{ mb: 1 }}>
              Historique des parties
            </Typography>

            {isLoading ? (
              <Stack alignItems="center" py={3}>
                <CircularProgress size={28} />
              </Stack>
            ) : null}

            {!isLoading && error ? <Alert severity="error">{error}</Alert> : null}

            {!isLoading && !error && sessions.length === 0 ? (
              <Alert severity="info">Aucune partie enregistree pour le moment.</Alert>
            ) : null}

            {!isLoading && !error && sessions.length > 0 ? (
              <TableContainer>
                <Table size="small" aria-label="Historique des parties">
                  <TableHead>
                    <TableRow>
                      <TableCell>Date</TableCell>
                      <TableCell align="right">Score</TableCell>
                      <TableCell align="right">Duree (s)</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {sessions.map((session) => (
                      <TableRow key={session.id}>
                        <TableCell>{formatSessionDate(session.completedAt || session.date)}</TableCell>
                        <TableCell align="right">{session.score}</TableCell>
                        <TableCell align="right">{session.duration ?? 0}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            ) : null}
          </Paper>

          {isAdmin ? (
            <Button
              variant="contained"
              color="primary"
              size="large"
              onClick={() => navigate('/admin/questions')}
            >
              Acceder a l'administration
            </Button>
          ) : null}

          <Button
            variant="contained"
            color="error"
            size="large"
            onClick={() => authService.logout()}
            sx={{ mt: 1 }}
          >
            Deconnexion
          </Button>
        </Stack>
      </Container>
    </Box>
  );
}

