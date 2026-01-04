import { isWithinInterval, parseISO, subDays, format } from 'date-fns';

export const TaskGenerator = {
    // Pure function now. Accepts data as args.
    generate: (dateString, clients = [], staff = [], plans = []) => {
        // 1. Get Data (Passed as args now)


        // 2. Filter Active Clients for this date
        const targetDate = parseISO(dateString);
        const activeClients = clients.filter(c => {
            // Check subscription range
            const start = parseISO(c.startDate);
            const end = parseISO(c.endDate);
            const isActive = isWithinInterval(targetDate, { start, end });
            // TODO: Exclude weekends if requirement says so? (Assumption: 7 days service for now)
            return isActive && c.status === 'active';
        });

        // 3. Prepare Tasks Grouped by Delivery Boy
        const tasksPerBoy = {
            unassigned: {
                boyName: 'UNASSIGNED',
                boyPhone: '-',
                items: [],
                summary: { tiffins: 0, emptyBoxes: 0 }
            }
        };

        // Initialize for all active staff
        staff.forEach(boy => {
            tasksPerBoy[boy.id] = {
                boyName: boy.name,
                boyPhone: boy.phone,
                items: [], // Array of deliveries
                summary: {
                    tiffins: 0,
                    emptyBoxes: 0
                }
            };
        });

        // 4. Assign Deliveries
        activeClients.forEach(client => {
            // Determine Driver: Check Override first, then Zone match
            let assignedBoy;

            if (client.assignedDriverId) {
                assignedBoy = staff.find(s => s.id === client.assignedDriverId);
            }

            if (!assignedBoy) {
                // Fallback to Zone Match
                assignedBoy = staff.find(s => s.assignedZoneId === client.zoneId);
            }

            // Pickup Logic & Counts
            const yesterday = subDays(targetDate, 1);
            const wasActiveYesterday = isWithinInterval(yesterday, { start: parseISO(client.startDate), end: parseISO(client.endDate) });

            let pickupCount = 0;
            const plan = plans.find(p => p.id === client.planId);

            if (wasActiveYesterday && !client.isTrial) {
                if (plan) {
                    pickupCount = plan.people || 1;
                } else if (client.planId === 'custom') {
                    pickupCount = 1;
                }
            }

            let deliverCount = 0;
            let planName = 'Custom';

            if (plan) {
                deliverCount = plan.people || 1;
                planName = plan.name;
            } else {
                deliverCount = 1;
            }

            const taskItem = {
                clientName: client.name,
                clientPhone: client.phone,
                address: client.address,
                plan: planName,
                toDeliver: deliverCount,
                hasRice: client.hasRice,
                riceQty: client.riceQty,
                toPickup: pickupCount,
                isTrial: client.isTrial
            };

            if (assignedBoy && tasksPerBoy[assignedBoy.id]) {
                tasksPerBoy[assignedBoy.id].items.push(taskItem);
                tasksPerBoy[assignedBoy.id].summary.tiffins += deliverCount;
                tasksPerBoy[assignedBoy.id].summary.emptyBoxes += pickupCount;
            } else {
                // Add to Unassigned
                tasksPerBoy['unassigned'].items.push(taskItem);
                tasksPerBoy['unassigned'].summary.tiffins += deliverCount;
                tasksPerBoy['unassigned'].summary.emptyBoxes += pickupCount;
            }
        });

        return tasksPerBoy;
    }
};
