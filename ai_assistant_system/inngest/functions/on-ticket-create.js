export const  onTicketCreated = inngest.createFunction(
    {id: "on-ticket-created"},
    {event: "ticket/created"},
    async ({event, step}) => {
        try {

            // fetch ticket from db
            const {ticketId} = event.data;
            const ticket = await step.run("fetch-ticket", async () >= {
                
            })
        }


}
)