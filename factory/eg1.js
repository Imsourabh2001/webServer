class Student
{
constructor()
{
console.log("Student class constructor got called");
}
}
class Customer
{
constructor()
{
console.log("Customer class constructor got called");
}
whatever(a,b)
{
console.log("Whatever is envoked");
return a+b;
}
}
class Factory
{
constructor()
{
this.items={
"Student":Student,
"Customer":Customer
};
}
createItem(itemName)
{
return new this.items[itemName];
}
}
var factory=new Factory();
var className="Customer";
var obj=factory.createItem(className);
var methodName="whatever";
console.log(obj[methodName](10,20));

