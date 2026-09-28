import webpush from "web-push";

const publicKey = process.env.VAPID_PUBLIC_KEY;
const privateKey = process.env.VAPID_PRIVATE_KEY;

webpush.setVapidDetails(
  "mailto:admin@example.com",
  publicKey,
  privateKey
);

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({
      success: false,
      message: "Method not allowed"
    });
  }

  try {
    const { subscription, title, body, url } = req.body;

    if (!subscription) {
      return res.status(400).json({
        success: false,
        message: "Subscription is required"
      });
    }

    await webpush.sendNotification(
      subscription,
      JSON.stringify({
        title: title || "رسالة جديدة",
        body: body || "لديك رسالة جديدة",
        url: url || "/"
      })
    );

    return res.status(200).json({
      success: true
    });

  } catch (error) {
    console.error(error);

    return res.status(500).json({
      success: false,
      message: "Failed to send notification"
    });
  }
}
