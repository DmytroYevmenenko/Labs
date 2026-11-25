@startuml
title Use Case діаграма — Сервіс прокату самокатів
left to right direction

actor "Гість" as Guest
actor "Користувач" as User
actor "Платіжний шлюз" as PaymentGateway

User --|> Guest

rectangle "Сервіс прокату самокатів" {
  usecase "Перегляд станцій та самокатів" as UC1
  usecase "Початок оренди самоката" as UC2
  usecase "Завершення поїздки та розрахунок вартості" as UC3
  usecase "Надсилання вебхуку статусу оплати" as UC4
  usecase "Перегляд історії поїздок" as UC5
}

Guest -- UC1
User -- UC2
User -- UC3
User -- UC5
PaymentGateway -- UC4

UC2 ..> UC1 : <<include>>
UC4 ..> UC3 : <<extend>>
@enduml