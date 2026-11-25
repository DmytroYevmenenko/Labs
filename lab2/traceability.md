# Матриця трасування (N:M)

| Вимога | Use Case | Сценарій (Gherkin) | Сутність БД (Завдання 1) | Покриття |
| :--- | :--- | :--- | :--- | :--- |
| **FR-01** | UC-1 | — | `STATION`, `SCOOTER` | Covered (UC) |
| **FR-02** | UC-1, UC-2 | — | `USER`, `SCOOTER`, `RENTAL` | Covered (UC) |
| **FR-03** | UC-3, UC-4 | Успішне завершення поїздки на вільній станції | `STATION`, `SCOOTER`, `RENTAL` | Covered |
| **FR-04** | UC-3 | Спроба завершення поїздки на переповненій станції | `STATION`, `RENTAL` | Covered |
| **FR-05** | UC-3, UC-4 | Помилка оплати при завершенні поїздки | `USER`, `SCOOTER`, `RENTAL` | Covered |
| **FR-06** | UC-3 | — | `SCOOTER`, `RENTAL` | Covered (UC) |
| **FR-07** | UC-3 | Зупинка поїздки при критичному розряді батареї | `SCOOTER`, `RENTAL` | Covered |
| **FR-08** | UC-5 | — | `USER`, `RENTAL` | Uncovered in Gherkin |

Примітка: `FR-01`, `FR-02`, `FR-06` охоплені Use Case і EARS, але окремих Gherkin-сценаріїв у цій версії не мають; `FR-08` поки без Gherkin-сценарію.