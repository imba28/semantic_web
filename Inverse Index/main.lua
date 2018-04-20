local fs = require("lfs")
local resource_path = lfs.currentdir() .. "/Inverse Index/resource"

for file in fs.dir(resource_path) do
  if file ~= "." and file ~= ".." then
    print(file)
  end
end