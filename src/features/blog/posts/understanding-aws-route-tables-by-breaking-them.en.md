---
title: "Understanding AWS Route Tables by Breaking Them"
description: "What finally made AWS VPC routing click for me after removing IGW routes, testing local routes, and checking longest prefix match."
publishedAt: 2026-08-13
tags: ["aws", "terraform", "networking", "vpc"]
draft: false
---

AWS route tables felt abstract to me until I started breaking them on purpose.

The lab that made this click was small on purpose: one VPC, one public subnet, one private subnet, one Internet Gateway, separate route tables, one public EC2 instance, and one private EC2 instance.

The interesting part was not the Terraform. It was watching which requests failed when I removed one piece at a time.

Source lab: [aws-terraform-labs/labs/24-network-routing](https://github.com/mohammedhammoud/aws-terraform-labs/tree/master/labs/24-network-routing)

## The model that stuck with me

A route table does one job:

```text
For this destination IP, where should the packet go next?
```

It does not care whether the subnet is called `public` or `private`. That label is really just a consequence of routing.

In the lab, the public route table had:

```text
10.0.0.0/16 -> local
0.0.0.0/0  -> Internet Gateway
```

The private route table had only:

```text
10.0.0.0/16 -> local
```

That was enough to create two very different behaviors.

## What made the public instance public

The public EC2 instance had a public IP and lived in the subnet with the `0.0.0.0/0 -> IGW` route.

From my machine:

```bash
curl http://<public-ip>
```

I got:

```text
hello from 24-network-routing
```

So far, nothing surprising.

Then I removed the Internet Gateway route from the public route table.

Same instance. Same public IP. Same Security Group.

Now the curl timed out.

That was the first useful failure.

A public IP is not enough. An inbound Security Group rule is not enough. The subnet also needs a route that actually points internet-bound traffic at the Internet Gateway.

That was the moment `public subnet` stopped sounding like a special AWS object and started meaning:

```text
a subnet whose route table can send 0.0.0.0/0 to an IGW
```

## What the private instance could still do

The private EC2 instance had no public IP, so this failed from my laptop:

```bash
curl http://<private-ip>
```

Expected.

But after SSHing into the public instance, I could curl the private one from inside the VPC:

```bash
ssh -i ~/.ssh/<private-key> ec2-user@<public-ip>
curl http://<private-ip>
```

Result:

```text
hello from 24-network-routing
```

No NAT Gateway. No Internet Gateway path to the private subnet. Still worked.

Why? Because every route table in the VPC automatically had the local route:

```text
10.0.0.0/16 -> local
```

That route is what makes intra-VPC traffic work.

This was the second part that made it click:

```text
private does not mean isolated from the VPC
private just means no direct internet path
```

## Routing and Security Groups are different layers

I then removed the private instance's HTTP ingress rule, while keeping the local route in place.

The internal curl from the public instance started timing out.

That was useful because the network path still existed.

The route table still knew how to reach the private IP. What changed was the permission to use that path.

That gave me a much better separation:

```text
route table = path
security group = permission
```

I used to blur those together. Breaking the lab made the difference obvious.

## Longest prefix match is the real rule

I also tested a more specific route:

```text
1.1.1.1/32 -> IGW
```

Now the route table effectively had:

```text
1.1.1.1/32 -> IGW
10.0.0.0/16 -> local
0.0.0.0/0 -> IGW
```

If multiple routes match a destination, AWS uses the most specific one.

So for `1.1.1.1`, both `/32` and `/0` match, but `/32` wins.

That rule matters more than most diagrams suggest. Route tables are not a top-to-bottom firewall rule list. They are a destination lookup where the longest prefix wins.

## How I think about it now

When I look at an AWS subnet now, I do not start with the subnet name. I start with these questions:

1. What CIDR does the VPC local route cover?
2. Where does `0.0.0.0/0` go, if anywhere?
3. Does the instance have a public IP?
4. Do Security Groups allow the traffic after the route is chosen?
5. Is there a more specific route that beats the default route?

That model explains most of the behavior I tested in this lab.

## The parts I still remember

This is the version I keep in my head now:

- a subnet is not public because AWS says so
- it is public if its route table sends internet traffic to an Internet Gateway
- the VPC local route is what makes instances inside the VPC reach each other
- Security Groups do not create paths; they only allow or block traffic on existing paths
- the most specific matching route wins

Once I started thinking in those terms, public/private VPC networking stopped feeling mysterious.
