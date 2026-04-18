export const  onTicketCreated = inngest.createFunction(
    {id: "on-ticket-created", retries:2 },
    {event: "ticket/created"},
    async ({event, step}) => {
        try {

            // fetch ticket from db
            const {ticketId} = event.data;
            const ticket = await step.run("fetch-ticket", async () => {
                const ticketObject = await Ticket.findById(ticketId);

                


            })
        }


}
)