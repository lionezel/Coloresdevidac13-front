import { db } from "@/src/firebase/config"
import { doc, runTransaction } from "firebase/firestore"

const COUNTER_DOC = doc(db, "config", "comanda_counter")

function getTodayDate(): string {
    // "YYYY-MM-DD" in local time
    const now = new Date()
    const y = now.getFullYear()
    const m = String(now.getMonth() + 1).padStart(2, '0')
    const d = String(now.getDate()).padStart(2, '0')
    return `${y}-${m}-${d}`
}

/**
 * Atomically returns the next daily order number from Firestore.
 * Resets to 1 whenever the date changes.
 */
export async function getNextOrderNumber(): Promise<number> {
    const today = getTodayDate()

    const next = await runTransaction(db, async (transaction) => {
        const snap = await transaction.get(COUNTER_DOC)

        if (!snap.exists() || snap.data().date !== today) {
            // First order of the day — reset to 1
            transaction.set(COUNTER_DOC, { date: today, count: 1 })
            return 1
        }

        const newCount = (snap.data().count as number) + 1
        transaction.update(COUNTER_DOC, { count: newCount })
        return newCount
    })

    return next
}
