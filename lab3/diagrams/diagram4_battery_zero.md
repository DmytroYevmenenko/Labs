### Діаграма 4 — Зупинка поїздки при критичному розряді батареї

```mermaid
sequenceDiagram
    participant Scooter as ScooterTelemetry
    participant Rental as RentalService
    participant Billing as BillingService
    participant Gateway as PaymentGateway
    actor User as Користувач

    activate Scooter
    Scooter-)Rental: reportTelemetry(scooterId, batteryLevel=0, coords)
    deactivate Scooter

    activate Rental
    Rental->>Rental: findActiveRentalByScooter(scooterId)
    activate Rental
    Rental-->>Rental: activeRental(rentalId, userId, startTime)
    deactivate Rental

    alt batteryLevel == 0
        Rental->>Rental: stopRideWithoutStation(rentalId, endTime)
        Note over Rental: SCOOTER.station_id лишається NULL до приїзду сервісу
        Rental->>Billing: calculateAndCharge(rentalId, startTime, endTime)
        activate Billing
        Billing->>Gateway: chargeUser(userId, totalCost)
        activate Gateway
        Gateway-->>Billing: chargeAccepted(txId)
        deactivate Gateway
        Billing-->>Rental: paymentInitiated(totalCost)
        deactivate Billing
        Rental--)User: notifyEmergencyBatteryStop(rentalId, totalCost)
    else batteryLevel > 0
        Rental->>Rental: updateCurrentBattery(scooterId, batteryLevel)
    end
    deactivate Rental
```