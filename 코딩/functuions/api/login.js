export async function onRequestPost(context) {
    try {
        const { request, env } = context;
        if (!env.USERS) {
            return new Response(JSON.stringify({ error: "Server KV (USERS) is not bound." }), { status: 500, headers: { "Content-Type": "application/json" } });
        }

        const data = await request.json();
        const { id, pw } = data;

        if (!id || !pw) {
            return new Response(JSON.stringify({ error: "아이디와 비밀번호를 입력해주세요." }), { status: 400, headers: { "Content-Type": "application/json" } });
        }

        const rawData = await env.USERS.get(id);
        if (!rawData) {
            return new Response(JSON.stringify({ error: "존재하지 않는 아이디입니다." }), { status: 404, headers: { "Content-Type": "application/json" } });
        }

        const user = JSON.parse(rawData);
        if (user.pw !== pw) {
            return new Response(JSON.stringify({ error: "비밀번호가 일치하지 않습니다." }), { status: 401, headers: { "Content-Type": "application/json" } });
        }

        return new Response(JSON.stringify({ success: true, user }), { status: 200, headers: { "Content-Type": "application/json" } });
    } catch (err) {
        return new Response(JSON.stringify({ error: err.message }), { status: 500, headers: { "Content-Type": "application/json" } });
    }
}
