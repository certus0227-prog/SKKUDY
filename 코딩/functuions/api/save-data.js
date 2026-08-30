export async function onRequestPost(context) {
    try {
        const body = await context.request.json();
        const { id, events, records } = body;
        const kv = context.env.USERS;

        const dataStr = await kv.get(id);
        if (!dataStr) {
            return new Response(JSON.stringify({ success: false, message: "사용자를 찾을 수 없습니다." }), {
                headers: { 'Content-Type': 'application/json' }
            });
        }

        let user = JSON.parse(dataStr);
        user.events = events;
        user.records = records;

        await kv.put(id, JSON.stringify(user));

        return new Response(JSON.stringify({ success: true }), {
            headers: { 'Content-Type': 'application/json' }
        });
    } catch (e) {
        return new Response(JSON.stringify({ success: false, message: e.message }), {
            headers: { 'Content-Type': 'application/json' },
            status: 500
        });
    }
}
