export async function onRequestPost(context) {
    try {
        const { id, records, events } = await context.request.json();
        const kv = context.env.USERS;

        const dataStr = await kv.get(id);
        if (!dataStr) {
            return new Response(JSON.stringify({ success: false }), { status: 404 });
        }

        const user = JSON.parse(dataStr);
        user.records = records;
        user.events = events;

        await kv.put(id, JSON.stringify(user));

        return new Response(JSON.stringify({ success: true }), {
            headers: { 'Content-Type': 'application/json' }
        });
    } catch (e) {
        return new Response(JSON.stringify({ success: false, message: e.message }), { status: 500 });
    }
}