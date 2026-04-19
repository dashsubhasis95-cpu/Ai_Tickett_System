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

            });

            const moderator = await step.run("fetch-moderator", async () => {
              const user = await User.findOne({role: "moderator", 
                skills: {
                  $elemMatch: {
                    $regrex: relatedSkills.join("|"),
                    $options: "i"
                  },
                },

              });

              if(!user){
                await User.findOne({role: "moderator"});
              }

              await Ticket.findByIdAndUpdate(ticket._id, {assignedTo: user?._id || null});

              return user;

            });

            await step.run("send-email-notifications", async () => {
              if(moderator){
                const finalticket = await Ticket.findById(ticketId);
                await sendEmail(
                  moderator.email,
                  "Ticket Assigned",
                  `A new ticket is assigned to you ${finalTicket.title}`


                );
              }
            });

            return {success: true};




        



            
  
            


        } catch (err) {
            console.error("Error processing ticket creation:", err.message);
            return { success: false};
        }

    }  


  
);