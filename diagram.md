# Use Case діаграма — Scooter Rental Service

```mermaid
flowchart LR
    Guest["Гість"]
    User["Користувач"]
    Bank["Платіжний провайдер"]

    subgraph System["Сервіс оренди електросамокатів"]
        UC1(["Перегляд станцій та самокатів"])
        UC2(["Початок оренди самоката"])
        UC3(["Завершення поїздки та оплата"])
        UC4(["Аварійне блокування при розряді"])
        UC5(["Перегляд історії поїздок"])
    end

    Guest --- UC1
    User --- UC1
    User --- UC2
    User --- UC3
    User --- UC5

    Bank --- UC3

    UC2 -.->|"<<include>>"| UC1
    UC3 -.->|"<<include>>"| UC4