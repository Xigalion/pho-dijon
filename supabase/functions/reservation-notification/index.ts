import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from "npm:@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Client-Info, Apikey",
};

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { status: 200, headers: corsHeaders });
  }

  try {
    const supabase = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? ""
    );

    const body = await req.json();
    const { reservationId, type } = body;

    if (type === "reservation" && reservationId) {
      const { data: reservation, error: resError } = await supabase
        .from("reservations")
        .select("*")
        .eq("id", reservationId)
        .maybeSingle();

      if (resError || !reservation) {
        return new Response(
          JSON.stringify({ error: "Reservation not found" }),
          { status: 404, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }

      const { data: settings } = await supabase
        .from("site_settings")
        .select("*")
        .eq("id", 1)
        .maybeSingle();

      if (!settings || !settings.email_notifications_enabled) {
        return new Response(
          JSON.stringify({ message: "Email notifications disabled" }),
          { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }

      const notificationEmail = settings.notification_email || settings.contact_email;

      const emailHtml = `
        <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; background: #1a2e1f; color: #f5f0e6; padding: 30px; border-radius: 12px;">
          <h1 style="font-size: 28px; color: #d4a843; margin-bottom: 20px;">Nouvelle Réservation — PHỞ Dijon</h1>
          <div style="background: #243b2a; padding: 20px; border-radius: 8px; margin-bottom: 20px;">
            <p style="margin: 8px 0;"><strong style="color: #d4a843;">Client:</strong> ${reservation.name}</p>
            <p style="margin: 8px 0;"><strong style="color: #d4a843;">Email:</strong> ${reservation.email}</p>
            <p style="margin: 8px 0;"><strong style="color: #d4a843;">Téléphone:</strong> ${reservation.phone}</p>
            <p style="margin: 8px 0;"><strong style="color: #d4a843;">Date:</strong> ${reservation.date}</p>
            <p style="margin: 8px 0;"><strong style="color: #d4a843;">Heure:</strong> ${reservation.time}</p>
            <p style="margin: 8px 0;"><strong style="color: #d4a843;">Personnes:</strong> ${reservation.guests}</p>
            <p style="margin: 8px 0;"><strong style="color: #d4a843;">Place:</strong> ${reservation.seating === "indoor" ? "Intérieur" : "Terrasse"}</p>
            ${reservation.special_request ? `<p style="margin: 8px 0;"><strong style="color: #d4a843;">Demande spéciale:</strong> ${reservation.special_request}</p>` : ""}
          </div>
          <p style="color: #8a9b8e; font-size: 14px;">Connectez-vous à votre espace gestion pour confirmer ou refuser cette réservation.</p>
          <a href="${Deno.env.get("SUPABASE_URL")?.replace(".supabase.co", "")}/admin" style="display: inline-block; background: #d4a843; color: #1a2e1f; padding: 12px 24px; border-radius: 6px; text-decoration: none; font-weight: bold; margin-top: 15px;">Voir l'Espace Gestion</a>
        </div>
      `;

      const { error: emailError } = await supabase.functions.invoke("send-email", {
        body: {
          to: notificationEmail,
          subject: `Nouvelle réservation — ${reservation.name} — ${reservation.date} à ${reservation.time}`,
          html: emailHtml,
        },
      });

      if (emailError) {
        console.error("Email send failed:", emailError);
        return new Response(
          JSON.stringify({ message: "Reservation saved, email notification pending", reservation }),
          { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }

      return new Response(
        JSON.stringify({ message: "Notification sent", reservation }),
        { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    if (type === "order" && reservationId) {
      const { data: order, error: orderError } = await supabase
        .from("orders")
        .select("*")
        .eq("id", reservationId)
        .maybeSingle();

      if (orderError || !order) {
        return new Response(
          JSON.stringify({ error: "Order not found" }),
          { status: 404, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }

      const { data: settings } = await supabase
        .from("site_settings")
        .select("*")
        .eq("id", 1)
        .maybeSingle();

      if (!settings || !settings.email_notifications_enabled) {
        return new Response(
          JSON.stringify({ message: "Email notifications disabled" }),
          { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }

      const notificationEmail = settings.notification_email || settings.contact_email;
      const itemsList = order.items?.map((item: any) => `${item.qty}× ${item.name} — ${(item.price * item.qty).toFixed(2)}€`).join("<br>") || "";

      const emailHtml = `
        <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; background: #1a2e1f; color: #f5f0e6; padding: 30px; border-radius: 12px;">
          <h1 style="font-size: 28px; color: #d4a843; margin-bottom: 20px;">Nouvelle Commande — PHỞ Dijon</h1>
          <div style="background: #243b2a; padding: 20px; border-radius: 8px; margin-bottom: 20px;">
            <p style="margin: 8px 0;"><strong style="color: #d4a843;">Client:</strong> ${order.customer_name}</p>
            <p style="margin: 8px 0;"><strong style="color: #d4a843;">Téléphone:</strong> ${order.customer_phone}</p>
            <p style="margin: 8px 0;"><strong style="color: #d4a843;">Type:</strong> ${order.type === "delivery" ? "Livraison" : "À emporter"}</p>
            ${order.address ? `<p style="margin: 8px 0;"><strong style="color: #d4a843;">Adresse:</strong> ${order.address}</p>` : ""}
            <p style="margin: 8px 0;"><strong style="color: #d4a843;">Articles:</strong><br>${itemsList}</p>
            <p style="margin: 8px 0;"><strong style="color: #d4a843;">Total:</strong> ${order.total.toFixed(2)}€</p>
          </div>
        </div>
      `;

      await supabase.functions.invoke("send-email", {
        body: {
          to: notificationEmail,
          subject: `Nouvelle commande — ${order.customer_name} — ${order.total.toFixed(2)}€`,
          html: emailHtml,
        },
      });

      return new Response(
        JSON.stringify({ message: "Order notification sent" }),
        { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    return new Response(
      JSON.stringify({ error: "Invalid request type" }),
      { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (err) {
    return new Response(
      JSON.stringify({ error: err.message }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
