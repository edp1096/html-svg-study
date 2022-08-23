<?xml version="1.0" encoding="UTF-8"?>
<xsl:stylesheet version="1.0" xmlns:xsl="http://www.w3.org/1999/XSL/Transform" xmlns:svg="http://www.w3.org/2000/svg">
<xsl:template match="/">

  <h2>SVG list</h2>

  <table border="1">
    <tr bgcolor="#9acd32">
      <th style="text-align:left">ID</th>
      <th style="text-align:left">ICON</th>
    </tr>
    <xsl:for-each select="//svg:symbol">
      <tr>
        <td><xsl:value-of select="@id"/></td>
        <td>
          <svg>
            <use>
              <xsl:attribute name="id"><xsl:value-of select="@id"/></xsl:attribute>
              <xsl:attribute name="href">icons.svg#<xsl:value-of select="@id"/></xsl:attribute>
            </use>
          </svg>
        </td>
      </tr>
    </xsl:for-each>
  </table>

</xsl:template>
</xsl:stylesheet>