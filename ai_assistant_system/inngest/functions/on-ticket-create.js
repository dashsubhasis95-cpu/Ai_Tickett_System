export const  onTicketCreated = inngest.createFunction(
    {id: "on-ticket-created", retries:2 },
    {event: "ticket/created"},
    async ({event, step}) => {
        try {

            // fetch ticket from db
            const {ticketId} = event.data;
            const ticket = await step.run("fetch-ticket", async () => {
                const ticketObject = await Ticket.findById(ticketId);
                if (!ticketObject) {
                    throw new NonRetriableError("Ticket not found");
                }

                return ticketObject;




            });


            await step.run("update-ticket-status", async () => {
                await Ticket.findByIdAndUpdate(ticketId, {status: "TODO"});
            });

            const aiResponse = await analyzeTicket(ticket);

            const relatedSkills = await step.run("fetch-related-skills", async () => {
              let skills = []
              if(airesponse){
                await Ticket.findByIdAndUpdate(ticketId, {
                  priority: ![low, medium, high].includes(aiResponse.priority) ? "medium" : aiResponse.priority,
                  helpfulNotes: aiResponse.helpfulNotes,
                  relatedSkills: aiResponse.relatedSkills,
                },


              
              );
                skills = aiResponse.relatedSkills;
              }

              return skills;

            })


            
  
            


        }


}
)