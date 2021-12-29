/**
 * wavecat
 */
public class wavecat extends ListenerAdapter
{
    public static void main(String[] args) throws LoginException
    {
        String token = "ODk0NTAwODMxMzM5MDk0MDE2.YVq60Q.6Sly9tpFRmhxF5EGHYo1EPjWzuc";
        if (args.length < 1) {
            System.out.println("You have to provide a token as first argument!");
            System.exit(1);
        }
        // args[0] should be the token
        // We only need 2 intents in this bot. We only respond to messages in guilds and private channels.
        // All other events will be disabled.
        JDABuilder.createLight(token, GatewayIntent.GUILD_MESSAGES, GatewayIntent.DIRECT_MESSAGES)
            .addEventListeners(new Bot())
            .setActivity(Activity.playing("Type ~ping"))
            .build();
    }
    
    @Override
    public void onMessageReceived(MessageReceivedEvent event)
    {
        Message msg = event.getMessage();
        if (msg.getContentRaw().equals("~ping"))
        {
            MessageChannel channel = event.getChannel();
            long time = System.currentTimeMillis();
            channel.sendMessage("Pong!") /* => RestAction<Message> */
                   .queue(response /* => Message */ -> {
                       response.editMessageFormat("Pong: %d ms", System.currentTimeMillis() - time).queue();
                   });
        }
    }
}