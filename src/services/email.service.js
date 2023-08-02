import { ProductDao } from "../DAO/classes/product.dao.js";
import { ProductService } from "./product.services.js";
import nodemailer from "nodemailer";

// const Ticket = new TicketService();
// const User = new UserService();
const Product = new ProductService();
const ProductD = new ProductDao();

export class EmailService {
    async sendEmail(user, ticket) {
        const transport = nodemailer.createTransport({
            service: "gmail",
            port: 587,
            auth: {
                user: process.env.GOOGLE_EMAIL,
                pass: process.env.GOOGLE_PASS,
            },
        });

        // const user = await User.getByEmail(email);
        const content = await this.getContent(ticket, user);

        // console.log("content", content);
        const result = await transport.sendMail({
            from: process.env.GOOGLE_EMAIL,
            to: process.env.EMAIL_TO,
            subject: "Ticket",
            html: content,
        });
    }

    async getContent(ticket, user) {
        const code = JSON.stringify(ticket.code);
        let content = `<div style="width: 60%">
            <h1>Se ha realizado su compra con éxito</h1>
            <div>
                <h2 style="text-transform: uppercase;">${user.firstName}</h2>
                <h3>Ticket ID: ${code}</h3>
                <div>
                    <table style="width: 100%;">
                        <thead style="text-align: left">
                            <tr>
                                <th>Producto</th>
                                <th>Precio Unit</th>
                                <th>Cantidad</th>
                            </tr>
                        </thead>
                    <tbody style="text-align: left">
                    `;

        for (const element of ticket.products) {
            // const prod = await Product.getById(element.productId);
            const prod = await ProductD.findOne(element.productId);
            let acu = `<tr>
                                <td>${prod.title}</td>
                                <td>$ ${prod.price}</td>
                                <td>${element.quantity}</td>
                            </tr>
                        `;
            content += acu;
        }

        content += ` </tbody>
                    </table>
                    </div>
                    <h3>Total: $ ${ticket.amount}</h3>
                </div>
            </div>`;

        return content;
    }

    // async getContent(ticket, user) {
    //     let content = `<div style="width: 60%">
    //     <h1>Se ha realizado su compra con exito</h1>
    //     <div>
    //         <h2>${user.firstName}</h2>
    //         <div>
    //             <ul>
    //                 <li>
    //                     <div style="display: flex; flex-direction: row; justify-content: space-between">
    //                         <h3>Producto</h3>
    //                         <h3>Precio</h3>
    //                         <h3>Cantidad</h3>
    //                     </div>
    //                 </li>
    //             `;

    //     await ticket.products.forEach(async (element) => {
    //         // const prod = await Product.getById(element.productId);
    //         const prod = await ProductD.findOne(element.productId);
    //         let acu = `<li>
    //                         <div style="display: flex; flex-direction: row; justify-content: space-between">
    //                             <h3>${prod.title}</h3>
    //                             <h3>$ ${prod.price}</h3>
    //                             <h3>${element.quantity}</h3>
    //                         </div>
    //                     </li>`;
    //         content += acu;
    //     });

    //     content += ` </ul>
    //                 </div>
    //                 <h3>Total: $ ${ticket.amount}</h3>
    //             </div>
    //         </div>`;

    //     return content;
    // }
}
