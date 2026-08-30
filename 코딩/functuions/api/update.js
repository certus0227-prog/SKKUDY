export async function onRequestPost(context) {
    try {
        const { request, env } = context;
        if (!env.USERS) {
            return new Response(JSON.stringify({ error: "Server KV (USERS) is not bound." }), { status: 500, headers: { "Content-Type": "application/json" } });
        }

        const data = await request.json();
        const { id, records, events } = data;

        if (!id) {
            return new Response(JSON.stringify({ error: "사용자 ID가 없습니다." }), { status: 400, headers: { "Content-Type": "application/json" } });
        }

        const rawData = await env.USERS.get(id);
        if (!rawData) {
            return new Response(JSON.stringify({ error: "존재하지 않는 사용자입니다." }), { status: 404, headers: { "Content-Type": "application/json" } });
        }

        let user = JSON.parse(rawData);
        user.records = records || [];
        user.events = events || {};

        await env.USERS.put(id, JSON.stringify(user));

        return new Response(JSON.stringify({ success: true }), { status: 200, headers: { "Content-Type": "application/json" } });
    } catch (err) {
        return new Response(JSON.stringify({ error: err.message }), { status: 500, headers: { "Content-Type": "application/json" } });
    }
}
