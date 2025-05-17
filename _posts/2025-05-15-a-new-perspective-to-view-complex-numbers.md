---
layout: post
title: A new perspective on complex numbers
subtitle: Something you might find useful
cover-img: /assets/img/maths-cover.jpg
thumbnail-img: /assets/img/maths-thumbnail.jpg
share-img: /assets/img/maths-cover.jpg
tags: [maths]
author: Dung Pham
---
# Introduction
Complex numbers are indeed one of the most useful ideas in mathematics, yet so terrifying to see for the first time. Like any other high school student, the first time I saw it in the solution of a polynomial equation that apparently has no solution, I was frustrated and felt a little sense of existential crisis.

After a long time battling with hundreds of physics problems that use complex numbers as a tool (electrical circuit, oscillation, wave equation,...), I began to appreciate their beauty and magical properties to handle some of the problems that would cause lots of headaches if we used real numbers to represent them. Inspired by 3Blue1Brown's mathematical intuition, that one guy who built a whole animation library just to animate his dark magic maths, now I can somehow confidently said that I've gained some useful perspective about complex numbers. In this blog, I'll show you another way to view it, rather than boring calculations and typical definitions you would encounter somewhere in textbooks.

# Polynomial equations
When it comes to polynomial equations, they usually tell us that there are 3 cases for solutions of this type of equation:
- $\Delta$ < 0: no solution.
- $\Delta$ = 0: 2 similar solutions.
- $\Delta$ > 0: 2 distinct solutions.

If the equation has real solutions, that could be any real numbers you can think of: $1, 3, -9, \sqrt2,...$. This solution can be either humble numbers like integers, fractions, or more fancy numbers like rational numbers, or maybe even more fancy numbers like irrational numbers, but not transcendental one like $\pi$ and $e$. This is likely the most popular case, so it is easy to understand. But something strange and hard to articulate if the solution is a complex number. 

Regularly, when a solution of a polynomial equation is a complex number, students usually find it strange and hard to understand. There are so many reasons why this may cause such trauma: what in the world can have that kind of number as a solution, what is the $i$ doing over there, how can I interpret this solution in a meaningful way...

# Solutions as tranformations
Actually, we can view the complex solution as a transformation on something rather than just a number as real numbers. Imagine that someone has just given us something to toy with, it could be a sphere, a cube or any object we can imagine (just think of it as some 3D object to avoid headache), and our task is to apply some kind of transformation on that object to make it into something new.

Now, if our equation yields real solutions, we can interpret that the necessary transformation is just a scalar operator. There are three cases with the solution:
- If it is positive, the object gets larger.
- If it is negative, the object gets smaller.
- Otherwise, the object gets truncated into lower dimensional shape: a sphere becomes a plane, a plane becomes a line, a line becomes a dot,.... But things seem much more complicated in the case of complex solutions.

In a complex number written in algebraic form:

$$a + ib$$

where $a$ and $b$ are called the real part and imaginary part, respectively. Obviously, these two parts are not compatible under addition or subtraction; that's why we have to separate them as displayed in the definition. Therefore, we can say that they are independent or orthogonal to each other, and this view leads to the realization that these two parts must represent independent transformations.

If we agree that the real part represents a scalar operation, we can say that the imaginary part may represent a rotational operation. Since these two transformations are independent (we can clearly see that if we rotate a sphere 90 degrees, its size remains unchanged), we can interpret that the complex solution is just applying two independent operations on the object: one to change its size and one to change its direction. Now, we can see that the transformation we need to apply to our object in this scenario is not simply a size-changing magical spell, it's a spell that not only change sizes but also directions.

This interpretation actually comes from a very popular formula about complex numbers that we (funny physicists that cruelly view a cow as a sphere) use on a regular basis, which is:

$$a + ib = re^{i\phi}$$

where $r$ and $\phi$ can be viewed as the scalar factor and angle under rotation, respectively.

# Extending to quaternions and octonions
The rotation in complex numbers we have discussed so far is just a rotation in a 2D plane along the z-axis, perpendicular to the plane. Since our world is not in a 2D dimension but a 3D dimension, an object may have many ways to rotate. To be specific, any complicated rotations acting on an object in a 3D dimension can be dissected into 3 separate rotations perpendicular to one another: rotate along the x-axis, y-axis, and z-axis. These rotations establish something called the **basis** for any arbitrary rotations in 3D (anyone familiar with linear algebra would feel a little nostalgic here). This idea extends us to the existence of quaternions, a kind of number that triggers, as threefold scarier the crisis that complex numbers have done to us miserable humans, since it contains 3 imaginary components.

The general form of a quaternion is as follows:

$$a + bi + cj + dk$$

where $i, j, k$ are imaginary components, represent rotations in each axis, and $a, b, c, d$ are all real numbers.

Clearly, mathematicians are not satisfied with traumatizing themselves with just 3 imaginary components. They extend it to another level of a Cruciatus Curse with the birth of Octonions (8 imaginary components) and Trigintaduonions (32 imaginary components).

These numbers with an immense number of imaginary components surely don't fit into the humble world of 3D dimensionality. Their imaginary components can be thought as corresponding with other types of rotations in an n-dimensional abstract space, or can be generalized to any independent operations you can think of (change colors, viscosity, or maybe assuming those objects have emotion, then change it 👑).

# Conclusion

In this blog, I don't want to be viewed as a lawyer defending the terrifying appearance of complex numbers. I just want to spread this idea and give some inspirations to those who feel that those numbers are kinds of intangible and hard to interpret. Also, not so sure but if we try to embed some physics imagination into these seemingly mathematical complicated concepts, there is maybe a way for us to see their true beauty and raise our awareness and appreciation of their existence as an indispensable tools to model and understand the world around us, rather than some scary mathematical notations used to traumatize miserable students.
