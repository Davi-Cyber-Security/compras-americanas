import { useState, useEffect, useRef } from 'react';
import { api } from '../services/api';
import type { HistoryGroup } from '../types';
import '../styles/history.css';

const MONTH_NAMES = [
  '', 'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
  'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro',
];

const POLL_INTERVAL = 10000;

export default function VotingHistory() {
  const [history, setHistory] = useState<HistoryGroup>({});
  const [loading, setLoading] = useState(true);
  const [expandedYear, setExpandedYear] = useState<string | null>(null);
  const [expandedMonth, setExpandedMonth] = useState<string | null>(null);
  const [expandedDay, setExpandedDay] = useState<string | null>(null);
  const pollingRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    const load = () => {
      api
        .get('/voting/history')
        .then((data) => setHistory(data))
        .catch(console.error)
        .finally(() => setLoading(false));
    };

    load();
    pollingRef.current = setInterval(load, POLL_INTERVAL);
    return () => {
      if (pollingRef.current) clearInterval(pollingRef.current);
    };
  }, []);

  const toggleYear = (year: string) =>
    setExpandedYear(expandedYear === year ? null : year);
  const toggleMonth = (key: string) =>
    setExpandedMonth(expandedMonth === key ? null : key);
  const toggleDay = (key: string) =>
    setExpandedDay(expandedDay === key ? null : key);

  if (loading) {
    return (
      <div className="history-loading">
        <div className="spinner" />
        <p>Carregando histórico...</p>
      </div>
    );
  }

  const years = Object.keys(history).sort((a, b) => Number(b) - Number(a));

  return (
    <div className="history-page">
      <h2 className="page-title">Histórico de Votação</h2>

      {years.length === 0 ? (
        <p className="empty-message">Nenhum histórico de votação encontrado.</p>
      ) : (
        <div className="history-tree">
          {years.map((year) => (
            <div key={year} className="history-year">
              <button
                className={`tree-toggle year-toggle ${
                  expandedYear === year ? 'open' : ''
                }`}
                onClick={() => toggleYear(year)}
              >
                <svg viewBox="0 0 24 24" className="toggle-icon">
                  <path d="M10 6L8.59 7.41 13.17 12l-4.58 4.59L10 18l6-6z" />
                </svg>
                {year}
              </button>

              {expandedYear === year && (
                <div className="tree-children">
                  {Object.keys(history[year])
                    .sort((a, b) => Number(b) - Number(a))
                    .map((month) => {
                      const monthKey = `${year}-${month}`;
                      return (
                        <div key={monthKey} className="history-month">
                          <button
                            className={`tree-toggle month-toggle ${
                              expandedMonth === monthKey ? 'open' : ''
                            }`}
                            onClick={() => toggleMonth(monthKey)}
                          >
                            <svg
                              viewBox="0 0 24 24"
                              className="toggle-icon"
                            >
                              <path d="M10 6L8.59 7.41 13.17 12l-4.58 4.59L10 18l6-6z" />
                            </svg>
                            {MONTH_NAMES[Number(month)]}
                          </button>

                          {expandedMonth === monthKey && (
                            <div className="tree-children">
                              {Object.keys(history[year][month])
                                .sort((a, b) => Number(b) - Number(a))
                                .map((day) => {
                                  const dayKey = `${year}-${month}-${day}`;
                                  const entries =
                                    history[year][month][day];
                                  return (
                                    <div
                                      key={dayKey}
                                      className="history-day"
                                    >
                                      <button
                                        className={`tree-toggle day-toggle ${
                                          expandedDay === dayKey
                                            ? 'open'
                                            : ''
                                        }`}
                                        onClick={() => toggleDay(dayKey)}
                                      >
                                        <svg
                                          viewBox="0 0 24 24"
                                          className="toggle-icon"
                                        >
                                          <path d="M10 6L8.59 7.41 13.17 12l-4.58 4.59L10 18l6-6z" />
                                        </svg>
                                        Dia {day}
                                      </button>

                                      {expandedDay === dayKey && (
                                        <div className="day-entries">
                                          {entries.map((entry, idx) => (
                                            <div
                                              key={idx}
                                              className="history-entry"
                                            >
                                              <span className="entry-email">
                                                {entry.email}
                                              </span>
                                              <span className="entry-product">
                                                {entry.products_name}
                                              </span>
                                              <span className="entry-type">
                                                {entry.type}
                                              </span>
                                              <span className="entry-time">
                                                {entry.vote_time}
                                              </span>
                                            </div>
                                          ))}
                                        </div>
                                      )}
                                    </div>
                                  );
                                })}
                            </div>
                          )}
                        </div>
                      );
                    })}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
