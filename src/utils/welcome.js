module.exports = () => {
    let message = "Eu posso fazer cotações e te avisar quando um ativo está bom para compra ou venda. ";
    message += "Me mande algum dos comandos abaixo:\n"
    message += "\n<b>lista</b>\n(lista todos os seus avisos)\n"
    message += "\n<b>cotacao</b> ITSA4\n(retorna cotação do ativo)\n"
    message += "\n<b>compra</b> EGIE3 20\n(avisa quando o ativo estiver menor ou igual ao valor desejado)\n"
    message += "\n<b>venda</b> LWSA3 90\n(avisa quando o ativo estiver maior ou igual ao valor desejado)\n"

    return message;
}