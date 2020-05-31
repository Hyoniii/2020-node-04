const alert = (msg,location=null) => {
    return `<script> 
    alert("${msg}");
    ${location ? "location.href= '"+location+"';": ";"}
    </script>`;
}
const imgExt = [".jpg", ".jpeg", ".gif", ".png"]
const allowExt =  [...imgExt, ".pdf", ".zip"]
module.exports = { alert, imgExt, allowExt }